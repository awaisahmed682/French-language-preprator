"use server";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJson, safeStringify } from "@/lib/utils";
import { BADGES } from "@/lib/badges";
import type { Level } from "@/lib/types";

function leagueForXp(xp: number): "BRONZE" | "SILVER" | "GOLD" | "DIAMOND" {
  if (xp >= 8000) return "DIAMOND";
  if (xp >= 3000) return "GOLD";
  if (xp >= 1000) return "SILVER";
  return "BRONZE";
}

function localDateStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + days);
  return localDateStr(d);
}

interface ActivityResult {
  xp: number;
  xpEarned: number;
  streak: number;
  league: "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
  newBadges: string[];
  xpToNextLeague: number;
}

export async function recordActivity(activity: {
  xp?: number;
  lessonId?: string;
  lessonLevel?: Level;
  skillScores?: { skills: string[]; scores: number[] };
  practiceResult?: { level: Level; kind: string; score: number; max: number };
  pronunciation?: { level: Level; target: string; score: number };
}): Promise<ActivityResult> {
  const user = await requireSession();
  const earned = Math.max(0, Math.round(activity.xp ?? 0));

  const [gamification, progress] = await Promise.all([
    prisma.gamification.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    }),
    prisma.progress.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    }),
  ]);

  const activeDates = parseJson<string[]>(gamification.dailyGoalMet, []);
  const today = localDateStr();
  const activities = parseJson<string[]>(gamification.badges, []);

  const updatedDates = activeDates.includes(today)
    ? activeDates
    : [today, ...activeDates.slice(0, 59)];

  let streak = 0;
  let probe = updatedDates.includes(today) ? today : shiftDate(today, -1);
  while (updatedDates.includes(probe)) {
    streak += 1;
    probe = shiftDate(probe, -1);
  }

  const xp = gamification.xp + earned;
  const league = leagueForXp(xp);

  const lessonCount = parseJson<string[]>(progress.completedLessons, []).length;
  const newBadges = BADGES.filter(
    (b) => !activities.includes(b.id) && b.test({ xp, streak, lessonCount, activityCount: updatedDates.length })
  ).map((b) => b.id);

  await prisma.gamification.update({
    where: { id: gamification.id },
    data: {
      xp,
      streakCurrent: streak,
      streakLongest: Math.max(gamification.streakLongest, streak),
      dailyGoalMet: safeStringify(updatedDates),
      league,
      badges: safeStringify([...activities, ...newBadges]),
    },
  });

  const updates: Record<string, unknown> = {};
  if (activity.lessonId) {
    const completed = parseJson<string[]>(progress.completedLessons, []);
    if (!completed.includes(activity.lessonId)) completed.push(activity.lessonId);
    updates.completedLessons = safeStringify(completed);
  }
  if (activity.skillScores) {
    const scores = parseJson<Record<string, number>>(progress.skillScores, {});
    activity.skillScores.skills.forEach((skill, i) => {
      const current = scores[skill] ?? 0;
      scores[skill] = Math.round((current + activity.skillScores!.scores[i]) / 2);
    });
    updates.skillScores = safeStringify(scores);
  }
  if (activity.practiceResult) {
    const list = parseJson<
      { id: string; level: string; kind: string; score: number; max: number; date: string }[]
    >(progress.practiceTests, []);
    list.unshift({
      id: `pt_${Date.now()}`,
      level: activity.practiceResult.level,
      kind: activity.practiceResult.kind,
      score: activity.practiceResult.score,
      max: activity.practiceResult.max,
      date: new Date().toISOString(),
    });
    updates.practiceTests = safeStringify(list.slice(0, 50));
  }
  if (activity.pronunciation) {
    const list = parseJson<
      { level: string; target: string; score: number; date: string }[]
    >(progress.pronunciationScores, []);
    list.unshift({
      level: activity.pronunciation.level,
      target: activity.pronunciation.target,
      score: activity.pronunciation.score,
      date: new Date().toISOString(),
    });
    updates.pronunciationScores = safeStringify(list.slice(0, 100));
  }
  if (earned > 0 || activity.lessonId) {
    updates.timeSpentMinutes = { increment: 2 };
  }
  const keys = Object.keys(updates);
  if (keys.length > 0) {
    await prisma.progress.update({ where: { id: progress.id }, data: updates });
  }

  const [nextLeague, currentLeague] = [
    leagueForXp(xp + 1),
    league,
  ];
  void nextLeague;
  void currentLeague;
  const thresholds: Record<string, number> = { BRONZE: 1000, SILVER: 3000, GOLD: 8000, DIAMOND: Infinity };
  const xpToNextLeague =
    thresholds[league] === Infinity ? 0 : Math.max(0, thresholds[league] - xp);

  return {
    xp,
    xpEarned: earned,
    streak,
    league,
    newBadges,
    xpToNextLeague,
  };
}

export async function completeTopicRound(level: Level, topicId: string, topScorePct: number) {
  return recordActivity({
    xp: Math.max(10, Math.round(topScorePct * 30)),
    lessonId: topicId,
    lessonLevel: level,
    skillScores: { skills: ["grammar"], scores: [topScorePct] },
  });
}

export async function recordPracticeRound(level: Level, score: number, max: number) {
  return recordActivity({
    xp: Math.round((score / max) * 40),
    practiceResult: { level, kind: "practice", score, max },
  });
}

export async function recordSpeakingActivity(level: Level, target?: string, score?: number) {
  if (target !== undefined && score !== undefined) {
    return recordActivity({
      xp: 20,
      pronunciation: { level, target, score },
    });
  }
  return recordActivity({ xp: 20 });
}

export async function dashboardSnapshot() {
  const user = await requireSession();
  const [gamification, progress, certificates] = await Promise.all([
    prisma.gamification.findUnique({ where: { userId: user.id } }),
    prisma.progress.findUnique({ where: { userId: user.id } }),
    prisma.certificate.findMany({
      where: { userId: user.id },
      orderBy: { issuedAt: "desc" },
    }),
  ]);

  return {
    progress: {
      completedLessons: parseJson<string[]>(progress?.completedLessons, []),
      skillScores: parseJson<Record<string, number>>(progress?.skillScores, {}),
      practiceTests: parseJson<
        { id: string; level: string; kind: string; score: number; max: number; date: string }[]
      >(progress?.practiceTests, []),
      pronunciationScores: parseJson<
        { level: string; target: string; score: number; date: string }[]
      >(progress?.pronunciationScores, []),
    },
    gamification: {
      xp: gamification?.xp ?? 0,
      streak: gamification?.streakCurrent ?? 0,
      streakLongest: gamification?.streakLongest ?? 0,
      league: gamification?.league ?? "BRONZE",
      badges: parseJson<string[]>(gamification?.badges, []),
      xpToNextLeague: (() => {
        const thresholds: Record<string, number> = { BRONZE: 1000, SILVER: 3000, GOLD: 8000, DIAMOND: Infinity };
        const lg = gamification?.league ?? "BRONZE";
        return thresholds[lg] === Infinity ? 0 : Math.max(0, thresholds[lg] - (gamification?.xp ?? 0));
      })(),
    },
    certificates: certificates.map((c) => ({
      id: c.id,
      level: c.level,
      score: c.score,
      verificationCode: c.verificationCode,
      issuedAt: c.issuedAt.toISOString(),
    })),
  };
}