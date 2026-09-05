import { LEVEL_ORDER, type Level, type LevelContent } from "@/lib/types";
import { a1 } from "@/lib/content/a1";
import { a2 } from "@/lib/content/a2";
import { b1 } from "@/lib/content/b1";
import { b2 } from "@/lib/content/b2";
import { c1 } from "@/lib/content/c1";
import { c2 } from "@/lib/content/c2";

export const LEVEL_CONTENTS: Record<Level, LevelContent> = {
  A1: a1,
  A2: a2,
  B1: b1,
  B2: b2,
  C1: c1,
  C2: c2,
};

export const LEVEL_CONTENT_LIST: LevelContent[] = LEVEL_ORDER.map(
  (level) => LEVEL_CONTENTS[level],
);

export function getLevelContent(level: Level): LevelContent {
  return LEVEL_CONTENTS[level];
}

export function getAllLevels(): LevelContent[] {
  return LEVEL_CONTENT_LIST;
}

export function getNextLevel(level: Level): Level | null {
  const idx = LEVEL_ORDER.indexOf(level);
  if (idx === -1 || idx >= LEVEL_ORDER.length - 1) return null;
  return LEVEL_ORDER[idx + 1];
}

export function getPreviousLevel(level: Level): Level | null {
  const idx = LEVEL_ORDER.indexOf(level);
  if (idx <= 0) return null;
  return LEVEL_ORDER[idx - 1];
}