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
  if (!session_id) return res.status(400).send("Missing session_id");

  await prisma.payment.updateMany({
    where: { stripeSessionId: session_id as string },
    data: { status: "SUCCESS" },
  });

  res.send("✅ Payment successful, job activated!");
}

export async function cancel(_req: Request, res: Response) {
  res.send("❌ Payment cancelled");
}
