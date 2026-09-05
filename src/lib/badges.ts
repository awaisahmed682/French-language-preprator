export interface BadgeMeta {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export const BADGES: {
  id: string;
  name: string;
  desc: string;
  icon: string;
  test: (s: { xp: number; streak: number; lessonCount: number; activityCount: number }) => boolean;
}[] = [
  { id: "first-steps", name: "First steps", desc: "Complete your first activity.", icon: "🌱", test: (s) => s.activityCount >= 1 },
  { id: "streak-3", name: "Consistency", desc: "3 days in a row.", icon: "🔥", test: (s) => s.streak >= 3 },
  { id: "streak-7", name: "Full week", desc: "7 days in a row.", icon: "⚡", test: (s) => s.streak >= 7 },
  { id: "xp-200", name: "On the road", desc: "Earn 200 XP.", icon: "🚀", test: (s) => s.xp >= 200 },
  { id: "xp-1000", name: "Thousand", desc: "Earn 1,000 XP.", icon: "🏅", test: (s) => s.xp >= 1000 },
  { id: "xp-5000", name: "Fifty thousand", desc: "Earn 5,000 XP.", icon: "💎", test: (s) => s.xp >= 5000 },
  { id: "lessons-10", name: "Ten lessons", desc: "Complete 10 lessons.", icon: "📚", test: (s) => s.lessonCount >= 10 },
  { id: "lessons-30", name: "Library", desc: "Complete 30 lessons.", icon: "🏛️", test: (s) => s.lessonCount >= 30 },
];

export const BADGE_INFO: Record<string, BadgeMeta> = Object.fromEntries(
  BADGES.map((b) => [b.id, { id: b.id, name: b.name, desc: b.desc, icon: b.icon }])
);