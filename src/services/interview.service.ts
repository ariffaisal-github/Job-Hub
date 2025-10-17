import { prisma } from "../config/prisma";
import { InterviewStatus } from "@prisma/client";

export async function createInterview(
  employerId: string,
  applicantId: string,
  jobId: string,
  scheduledTime: string,
  notes?: string
) {
  return prisma.interview.create({
    data: {
      employerId,
      applicantId,
      jobId,
      scheduledTime: new Date(scheduledTime),
      notes: notes ?? null,
      status: InterviewStatus.SCHEDULED,
    },
  });
}

export async function getInterviewsForUser(userId: string, role: string) {
  if (role === "EMPLOYER") {
    return prisma.interview.findMany({
      where: { employerId: userId },
      include: { job: true, applicant: true },
    });
  }
  if (role === "EMPLOYEE") {
    return prisma.interview.findMany({
      where: { applicantId: userId },
      include: { job: true, employer: true },
    });
  }
  return prisma.interview.findMany({
    include: { job: true, employer: true, applicant: true },
  });
}

export async function cancelInterview(id: string, userId: string) {
  const interview = await prisma.interview.findUnique({ where: { id } });
  if (!interview) throw new Error("Interview not found");

  if (interview.employerId !== userId && interview.applicantId !== userId)
    throw new Error("Not authorized to cancel this interview");

  return prisma.interview.update({
    where: { id },
    data: { status: InterviewStatus.CANCELLED },
  });
}

export async function rescheduleInterview(
  id: string,
  userId: string,
  newTime: string
) {
  const interview = await prisma.interview.findUnique({ where: { id } });
  if (!interview) throw new Error("Interview not found");

  if (interview.applicantId !== userId)
    throw new Error("Only applicant can request reschedule");

  return prisma.interview.update({
    where: { id },
    data: {
      scheduledTime: new Date(newTime),
      status: InterviewStatus.RESCHEDULE_REQUESTED,
    },
  });
}
