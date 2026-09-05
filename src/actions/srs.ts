"use server";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { SrsItemType } from "@prisma/client";
import type { Level } from "@/lib/types";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function reviewSrsItem(
  itemId: string,
  itemType: SrsItemType,
  quality: number // 0..5 (SM-2)
) {
  const user = await requireSession();
  const previous = await prisma.srsReview.findUnique({
    where: { userId_itemId: { userId: user.id, itemId } },
  });

  const easeFactor = Math.max(1.3, (previous?.easeFactor ?? 2.5) + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  const repetitions = quality < 3 ? 0 : (previous?.repetitions ?? 0) + 1;

  let interval: number;
  if (repetitions === 0) interval = 1;
  else if (repetitions === 1) interval = 3;
  else if (repetitions === 2) interval = 6;
  else interval = Math.round((previous?.interval ?? 6) * easeFactor);

  const dueDate = new Date(Date.now() + interval * DAY_MS);

  await prisma.srsReview.upsert({
    where: { userId_itemId: { userId: user.id, itemId } },
    create: {
      userId: user.id,
      itemId,
      itemType,
      dueDate,
      interval,
      repetitions,
      easeFactor,
      lastReviewed: new Date(),
    },
    update: {
      dueDate,
      interval,
      repetitions,
      easeFactor,
      lastReviewed: new Date(),
    },
  });

  return { dueDate, interval, repetitions, easeFactor, quality };
}

export async function getDueSrsItems(limit = 30) {
  const user = await requireSession();
  const now = new Date();
  const items = await prisma.srsReview.findMany({
    where: { userId: user.id, dueDate: { lte: now } },
    orderBy: { dueDate: "asc" },
    take: limit,
  });
  return items.map((i) => ({
    itemId: i.itemId,
    itemType: i.itemType,
    dueDate: i.dueDate.toISOString(),
    interval: i.interval,
    repetitions: i.repetitions,
    easeFactor: i.easeFactor,
  }));
}

export async function scheduleSrsItems(
  items: { itemId: string; itemType: SrsItemType; level: Level }[]
) {
  const user = await requireSession();
  const now = new Date();
  let created = 0;
  for (const item of items) {
    const existing = await prisma.srsReview.findUnique({
      where: { userId_itemId: { userId: user.id, itemId: item.itemId } },
    });
    if (existing) continue;
    await prisma.srsReview.create({
      data: {
        userId: user.id,
        itemId: item.itemId,
        itemType: item.itemType,
        dueDate: now,
        interval: 1,
        repetitions: 0,
        easeFactor: 2.5,
      },
    });
    created += 1;
  }
  return { created };
}

export async function srsQueueCount() {
  const user = await requireSession();
  return prisma.srsReview.count({
    where: { userId: user.id, dueDate: { lte: new Date() } },
  });
}