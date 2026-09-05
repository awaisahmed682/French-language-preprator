"use server";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LEVEL_ORDER, type Level } from "@/lib/types";
import { getLevelContent } from "@/lib/content";
import { parseJson, safeStringify } from "@/lib/utils";

export interface TestSectionInput {
  listening: { score: number; max: number; answered: number };
  reading: { score: number; max: number; answered: number };
  writing: { score: number; max: number; answered: number };
  speaking: { score: number; max: number; answered: number };
  pronunciation: { score: number; max: number; answered: number };
}

export type SectionKey = "listening" | "reading" | "writing" | "speaking" | "pronunciation";

const sectionKeys: SectionKey[] = [
  "listening",
  "reading",
  "writing",
  "speaking",
  "pronunciation",
];

export interface TestResult {
  total: number;
  max: number;
  passing: number;
  passed: boolean;
  certificateId: string | null;
  skillBreakdown: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
    pronunciation: number;
    max: number;
  };
  level: Level;
}

export async function submitCertificationTest(
  level: Level,
  sections: TestSectionInput
): Promise<{ error: string; level: Level } | TestResult> {
  const user = await requireSession();
  const content = getLevelContent(level);

  const expectedCounts: Record<SectionKey, number> = {
    listening: content.test.listening.length,
    reading: content.test.reading.length,
    writing: content.test.writing.length,
    speaking: content.test.speaking.length,
    pronunciation: content.test.pronunciation.length,
  };
  const missing = sectionKeys.filter((k) => sections[k].answered < expectedCounts[k]);
  if (missing.length > 0) {
    return {
      error:
        "Complete every section of the certification test (listening, reading, writing, speaking, pronunciation) before submitting.",
      level,
    };
  }

  const total =
    sections.listening.score +
    sections.reading.score +
    sections.writing.score +
    sections.speaking.score +
    sections.pronunciation.score;
  const max =
    sections.listening.max +
    sections.reading.max +
    sections.writing.max +
    sections.speaking.max +
    sections.pronunciation.max;

  const passing = content.test.passingScore;
  const passed = total >= passing;

  const skillBreakdown = {
    listening: sections.listening.score,
    reading: sections.reading.score,
    writing: sections.writing.score,
    speaking: sections.speaking.score,
    pronunciation: sections.pronunciation.score,
    max,
  };

  let certificateId: string | null = null;
  if (passed) {
    const verificationCode = `FP-${level}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const certificate = await prisma.certificate.create({
      data: {
        userId: user.id,
        level: level as Level,
        score: total,
        skillBreakdown: safeStringify(skillBreakdown),
        verificationCode,
      },
    });
    certificateId = certificate.id;

    const progress = await prisma.progress.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });
    const certifications = parseJson<string[]>(progress.certifications, []);
    if (!certifications.includes(certificateId)) certifications.unshift(certificateId);
    await prisma.progress.update({
      where: { id: progress.id },
      data: {
        certifications: safeStringify(certifications.slice(0, 20)),
        skillScores: safeStringify({
          ...parseJson<Record<string, number>>(progress.skillScores, {}),
          listening: Math.round((sections.listening.score / Math.max(1, sections.listening.max)) * 100),
          reading: Math.round((sections.reading.score / Math.max(1, sections.reading.max)) * 100),
          writing: Math.round((sections.writing.score / Math.max(1, sections.writing.max)) * 100),
          speaking: Math.round((sections.speaking.score / Math.max(1, sections.speaking.max)) * 100),
          pronunciation: Math.round(
            (sections.pronunciation.score / Math.max(1, sections.pronunciation.max)) * 100
          ),
        }),
      },
    });

    const userLevelIdx = LEVEL_ORDER.indexOf(user.currentLevel);
    const targetIdx = Math.max(userLevelIdx, LEVEL_ORDER.indexOf(level) + 1);
    const wanted = LEVEL_ORDER[Math.min(targetIdx, LEVEL_ORDER.length - 1)];
    if (await prisma.user.findUnique({ where: { id: user.id } })) {
      await prisma.user.update({ where: { id: user.id }, data: { currentLevel: wanted } });
    }
  }

  await prisma.gamification.upsert({
    where: { userId: user.id },
    create: { userId: user.id, xp: passed ? 100 : 25 },
    update: { xp: { increment: passed ? 100 : 25 } },
  });

  return {
    total,
    max,
    passing,
    passed,
    certificateId: passed ? certificateId : null,
    skillBreakdown,
    level,
  };
}

export async function verifyCertificate(code: string) {
  const certificate = await prisma.certificate.findUnique({
    where: { verificationCode: code },
    include: {
      user: { select: { name: true } },
    },
  });
  if (!certificate) return null;
  return {
    code: certificate.verificationCode,
    level: certificate.level,
    score: certificate.score,
    name: certificate.user.name,
    issuedAt: certificate.issuedAt.toISOString(),
    skillBreakdown: parseJson(certificate.skillBreakdown, {}),
  };
}