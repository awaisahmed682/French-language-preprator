"use server";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { recordActivity } from "@/actions/progress";
import type { Level } from "@/lib/types";

export async function submitWriting(content: string, level: Level) {
  const user = await requireSession();
  const trimmed = content.trim();
  if (trimmed.length < 20) {
    return { error: "Your text is too short (minimum 20 characters)." };
  }
  const submission = await prisma.submission.create({
    data: {
      userId: user.id,
      kind: "writing",
      content: trimmed,
      level,
    },
  });
  await recordActivity({ xp: 15 });
  return { id: submission.id };
}

export async function submitSpeaking(transcript: string, level: Level) {
  const user = await requireSession();
  const cleaned = transcript.trim();
  if (!cleaned) {
    return { error: "No transcript captured." };
  }
  const submission = await prisma.submission.create({
    data: {
      userId: user.id,
      kind: "speaking",
      content: cleaned,
      level,
      status: "pending",
    },
  });
  await recordActivity({ xp: 15 });
  return { id: submission.id };
}

export async function listSubmissions(kind?: "writing" | "speaking", level?: Level) {
  await requireSession();
  const submissions = await prisma.submission.findMany({
    where: {
      kind: kind ?? undefined,
      level: level ?? undefined,
      status: { in: ["published", "pending"] },
    },
    orderBy: { createdAt: "desc" },
    take: 40,
    include: {
      user: { select: { name: true } },
    },
  });
  return submissions.map((s) => ({
    id: s.id,
    kind: s.kind,
    content: s.content,
    level: s.level,
    status: s.status,
    feedback: s.feedback,
    feedbackScore: s.feedbackScore,
    author: s.user.name,
    createdAt: s.createdAt.toISOString(),
  }));
}

export async function reviewSubmission(
  submissionId: string,
  feedback: string,
  score: number
) {
  const user = await requireSession();
  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!submission) return { error: "Submission not found." };
  if (score < 0 || score > 100) return { error: "The score must be between 0 and 100." };

  const clamped = Math.round(score);
  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: "published",
      feedback: feedback.trim(),
      feedbackScore: clamped,
      reviewedBy: user.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.community.upsert({
    where: { userId: user.id },
    create: { userId: user.id, reviewsGiven: 1, reputation: 5 },
    update: {
      reviewsGiven: { increment: 1 },
      reputation: { increment: 5 },
    },
  });

  await prisma.community.upsert({
    where: { userId: submission.userId },
    create: { userId: submission.userId, reviewsGiven: 0, reputation: clamped },
    update: { reputation: { increment: clamped } },
  });

  return { id: updated.id, status: updated.status };
}

export async function mySubmissions() {
  const user = await requireSession();
  const submissions = await prisma.submission.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return submissions.map((s) => ({
    id: s.id,
    kind: s.kind,
    content: s.content,
    level: s.level as Level,
    status: s.status,
    feedback: s.feedback,
    feedbackScore: s.feedbackScore,
    author: user.name,
    createdAt: s.createdAt.toISOString(),
  }));
}