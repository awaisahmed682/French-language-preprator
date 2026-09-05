import "server-only";

import { prisma } from "./db";
import { LEVEL_ORDER, type Level } from "./types";
import { LEVEL_CONTENTS } from "./content";

export interface AdminStats {
  totals: {
    users: number;
    newUsers30d: number;
    certificates: number;
    totalXp: number;
    pendingSubmissions: number;
    totalSubmissions: number;
  };
  byLevel: Record<
    Level,
    { users: number; certificates: number }
  >;
  content: Record<
    Level,
    {
      grammarTopics: number;
      grammarExercises: number;
      vocabularyItems: number;
      phrases: number;
      reading: number;
      listening: number;
      writing: number;
      speaking: number;
      stories: number;
      scenarios: number;
      culturalNotes: number;
      testPassScore: number;
      testMaxScore: number;
    }
  >;
  recentCertificates: {
    id: string;
    level: string;
    score: number;
    issuedAt: string;
    verificationCode: string;
    holderName: string;
    holderEmail: string;
  }[];
  recentSubmissions: {
    id: string;
    kind: string;
    level: string;
    status: string;
    createdAt: string;
    authorName: string;
    authorEmail: string;
  }[];
}

export async function adminStats(): Promise<AdminStats> {
  const [users, certificates, submissions, xpAgg] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        currentLevel: true,
        createdAt: true,
      },
    }),
    prisma.certificate.findMany({
      select: {
        id: true,
        level: true,
        score: true,
        issuedAt: true,
        verificationCode: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { issuedAt: "desc" },
      take: 50,
    }),
    prisma.submission.findMany({
      select: {
        id: true,
        kind: true,
        level: true,
        status: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.gamification.aggregate({ _sum: { xp: true } }),
  ]);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const byLevel = {} as AdminStats["byLevel"];
  for (const level of LEVEL_ORDER) {
    byLevel[level] = { users: 0, certificates: 0 };
  }
  for (const u of users) {
    byLevel[u.currentLevel as Level].users += 1;
  }
  for (const c of certificates) {
    byLevel[c.level as Level].certificates += 1;
  }

  const content = {} as AdminStats["content"];
  for (const level of LEVEL_ORDER) {
    const lc = LEVEL_CONTENTS[level];
    content[level] = {
      grammarTopics: lc.grammar.length,
      grammarExercises: lc.grammar.reduce((n, t) => n + (t.exercises?.length ?? 0), 0),
      vocabularyItems: lc.vocabulary.reduce((n, v) => n + v.items.length, 0),
      phrases: lc.phrases.length,
      reading: lc.reading.length,
      listening: lc.listening.length,
      writing: lc.writingPrompts.length,
      speaking: lc.speakingPrompts.length,
      stories: lc.stories.length,
      scenarios: lc.scenarios.length,
      culturalNotes: lc.culturalNotes.length,
      testPassScore: lc.test.passingScore,
      testMaxScore: lc.test.maxScore,
    };
  }

  return {
    totals: {
      users: users.length,
      newUsers30d: users.filter((u) => u.createdAt >= thirtyDaysAgo).length,
      certificates: certificates.length,
      totalXp: xpAgg._sum.xp ?? 0,
      pendingSubmissions: submissions.filter((s) => s.status === "pending").length,
      totalSubmissions: submissions.length,
    },
    byLevel,
    content,
    recentCertificates: certificates.map((c) => ({
      id: c.id,
      level: c.level,
      score: c.score,
      issuedAt: c.issuedAt.toISOString(),
      verificationCode: c.verificationCode,
      holderName: c.user.name,
      holderEmail: c.user.email,
    })),
    recentSubmissions: submissions.map((s) => ({
      id: s.id,
      kind: s.kind,
      level: s.level,
      status: s.status,
      createdAt: s.createdAt.toISOString(),
      authorName: s.user.name,
      authorEmail: s.user.email,
    })),
  };
}