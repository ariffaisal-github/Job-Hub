import { Request, Response } from "express";
import { stripe } from "../config/stripe";
import { prisma } from "../config/prisma";

export async function createCheckout(req: Request, res: Response) {
  const { orgId, jobId } = req.body;
  const amount = 2; // USD per job after 3 free

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Job Posting Fee" },
          unit_amount: amount * 100, // cents
        },
        quantity: 1,
      },
    ],
    success_url:
      "http://localhost:4000/api/payment/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:4000/api/payment/cancel",
  });

  await prisma.payment.create({
    data: {
      orgId,
      jobId,
      amount,
      stripeSessionId: session.id,
      status: "PENDING",
    },
  });

  res.json({ url: session.url });
}

export async function success(req: Request, res: Response) {
  const { session_id } = req.query;

  if (!session_id || typeof session_id !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Missing session_id" });
  }

  // 1️⃣ Verify session with Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (!session || session.payment_status !== "paid") {
    return res
      .status(400)
      .json({ success: false, message: "Payment not completed yet." });
  }

  // 2️⃣ Find our Payment record
  const payment = await prisma.payment.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (!payment) {
    return res
      .status(404)
      .json({ success: false, message: "Payment record not found." });
  }

  // 3️⃣ Create the job now using stored metadata
  const jobData = JSON.parse(payment.metadata || "{}");
  const job = await prisma.job.create({
    data: {
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
      type: jobData.type,
      orgId: payment.orgId,
    },
  });

  // 4️⃣ Update payment status + attach jobId
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "SUCCESS", jobId: job.id },
  });

  return res.json({
    success: true,
    message: "Payment verified and job created successfully.",
    job,
  });
}

export async function cancel(_req: Request, res: Response) {
  res.json({ success: false, message: "Payment cancelled by user." });
}
