/* CommonJS Prisma seed for Français Prépa (idempotent). */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DAY = 24 * 60 * 60 * 1000;

async function main() {
  const email = "demo@french-language.app";
  const existing = await prisma.user.findUnique({ where: { email } });
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: { targetLevel: "B2" },
      })
    : await prisma.user.create({
        data: {
          name: "Étudiante de démonstration",
          email,
          passwordHash,
          currentLevel: "B1",
          targetLevel: "B2",
          nativeLanguage: "English",
          progress: {
            create: {
              skillScores: JSON.stringify({
                grammar: 55,
                vocabulary: 50,
                listening: 60,
                reading: 58,
                writing: 45,
                speaking: 40,
                pronunciation: 65,
              }),
            },
          },
          gamification: {
            create: { xp: 1250, streakCurrent: 4, streakLongest: 9, league: "SILVER" },
          },
          aiHistory: { create: {} },
          community: { create: { reviewsGiven: 2, reputation: 40 } },
        },
      });

  const vocab = await prisma.srsReview.upsert({
    where: { userId_itemId: { userId: user.id, itemId: "b1-phrase-0" } },
    create: {
      userId: user.id,
      itemId: "b1-phrase-0",
      itemType: "PHRASE",
      dueDate: new Date(Date.now() - DAY),
      interval: 3,
      repetitions: 1,
      easeFactor: 2.5,
    },
    update: {},
  });

  console.log(`Seed OK — user: ${user.email} (id=${user.id}) scolaire=${!!vocab}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());