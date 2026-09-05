export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type Level = (typeof LEVELS)[number];

export const LEVEL_NEXT: Record<Level, Level | null> = {
  A1: "A2",
  A2: "B1",
  B1: "B2",
  B2: "C1",
  C1: "C2",
  C2: null,
};

export const LEVEL_PREV: Record<Level, Level | null> = {
  A1: null,
  A2: "A1",
  B1: "A2",
  B2: "B1",
  C1: "B2",
  C2: "C1",
};

export const LEVEL_TITLES: Record<Level, string> = {
  A1: "Beginner (Découverte)",
  A2: "Elementary (Survie)",
  B1: "Intermediate (Seuil)",
  B2: "Upper Intermediate (Avancé)",
  C1: "Advanced (Autonomie)",
  C2: "Mastery (Maîtrise)",
};

export function levelIndex(level: Level): number {
  return LEVELS.indexOf(level);
}

export function levelAt(index: number): Level {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, index))];
}

export function isLevelUnlocked(current: Level, target: Level): boolean {
  return levelIndex(target) <= levelIndex(current);
}

export function className(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function normalizeInput(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export function answersMatch(userAnswer: string, accepted: string[]): boolean {
  const u = normalizeInput(userAnswer);
  const maxDist =
    u.length <= 4 ? 0 : u.length <= 8 ? 1 : Math.max(1, Math.floor(u.length / 8));
  return accepted.some((a) => {
    const t = normalizeInput(a);
    return u === t || levenshtein(u, t) <= maxDist;
  });
}

export function clamp(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, num));
}

export function random<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function uid(prefix = ""): string {
  const s = Math.random().toString(36).slice(2, 10);
  return prefix ? `${prefix}_${s}` : s;
}

export function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const MCQ_POINTS = 10;

export function mcqPoints(count: number): number {
  return count * MCQ_POINTS;
}

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}