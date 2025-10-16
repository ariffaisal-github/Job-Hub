import { prisma } from "../config/prisma";
import { stripe } from "../config/stripe";

export async function createJob(ownerId: string, data: any) {
  // find employer org first
  const org = await prisma.organization.findFirst({ where: { ownerId } });
  if (!org) throw new Error("Employer has no organization yet");

  // count jobs by this org
  const jobCount = await prisma.job.count({ where: { orgId: org.id } });

  // first 3 free, after that trigger Stripe checkout
  if (jobCount >= 3) {
    const amount = 2; // USD
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Job Posting Fee" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url:
        "http://localhost:4000/api/payment/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:4000/api/payment/cancel",
    });

    // record pending payment in DB
    await prisma.payment.create({
      data: {
        orgId: org.id,
        jobId: null, // job not created yet
        amount,
        stripeSessionId: session.id,
        status: "PENDING",
        metadata: JSON.stringify({
          title: data.title,
          description: data.description,
          location: data.location,
          type: data.type,
        }),
      },
    });

    return {
      paymentRequired: true,
      message: "Payment required before posting more jobs",
      checkoutUrl: session.url,
    };
  }

  // free post — create job directly
  const job = await prisma.job.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      type: data.type,
      orgId: org.id,
    },
  });

  return { job, paymentRequired: false };
}

export async function getAllJobs() {
  return prisma.job.findMany({
    include: { org: true },
  });
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({
    where: { id },
    include: { org: true, applications: true },
  });
}

export async function updateJob(id: string, data: any) {
  return prisma.job.update({
    where: { id },
    data,
  });
}

export async function deleteJob(id: string) {
  return prisma.job.delete({ where: { id } });
}
