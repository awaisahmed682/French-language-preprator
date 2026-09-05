# Français Prépa

An AI-powered French language learning platform built with **Next.js**, taking learners from **A1 (Beginner) to C2 (Mastery)** through lessons, spaced-repetition review, and a full CEFR certification test — with interactive AI tutors and a community writing/speaking exchange.

> 🌐 **Live demo:** https://fp-app-delta.vercel.app
>
> **Demo account:** `demo@french-language.app` / `demo1234`

---

## Features

### Learning path
- **6 CEFR levels** (A1 → C2) with grammar, vocabulary, pronunciation and cultural lessons
- **Stories, dialogues and real-life scenarios** in French with audio playback
- **Spaced-repetition review (SRS)** — vocabulary, grammar, phrases and phonemes scheduled optimally
- **Progress tracking** — skill scores, XP, streaks, daily goals, and leagues (Bronze → Diamond)

### Certification test
- A complete level exam covering **listening, reading, writing, speaking, and pronunciation**
- **Speech recognition** to score spoken answers (`Web Speech API`) with a manual typing fallback
- Generates a **verifiable certificate** with a unique code — check yours at `/certificates/{code}`
- The test only grades once **every section is completed** (both client and server enforce this)

### AI tools
- 🤖 **Explain** — simple-language explanations of grammar and vocabulary
- 🎭 **Roleplay** — practice real-life French conversations with an AI partner
- 👩‍🏫 **Tutor** — guided, level-adapted dialogue coaching

### Community
- **Writing & speaking prompts** submitted for review by other learners
- Feedback and reputation system

---

## Tech stack

| Layer         | Technology                                         |
| ------------- | -------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack), React 19       |
| Language      | TypeScript                                       |
| Styling       | Tailwind CSS v4 (paper/navy/gold theme, CSS animations) |
| Database      | PostgreSQL (Prisma ORM)                           |
| Auth          | JWT (jose, HS256), bcryptjs password hashing      |
| Validation    | Zod                                              |
| AI / Speech   | Web Speech API (TTS + STT)                        |
| Deploy        | Vercel + Neon Postgres                           |

---

## Getting started

### Prerequisites
- Node.js 20+
- PostgreSQL (local, or a free [Neon](https://neon.tech) instance)
- npm

### Setup

```bash
# 1. Clone & install
git clone https://github.com/awaisahmed682/French-language-preprator.git
cd French-language-preprator
npm install

# 2. Environment variables (.env)
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="a-long-random-string-for-signing-cookies"

# 3. Create the schema and seed the demo user
npm run db:push
npm run db:seed

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> ℹ️ The UI is in **English**; all learning content (lessons, stories, exercises) is in **French**, as the app is designed to immerse learners in the language.

---

## Scripts

| Command            | Description                             |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Start the Next.js dev server            |
| `npm run build`    | Production build                        |
| `npm run lint`     | ESLint                                  |
| `npm run typecheck`| TypeScript type checking                |
| `npm run db:push`  | Push the Prisma schema to the database  |
| `npm run db:seed`  | Seed the demo user                      |

---

## Deployment

Deployed on **Vercel** with a **Neon Postgres** database.

```bash
vercel link
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel deploy --prod
```

Protect the seeded demo credentials and keep `JWT_SECRET` private in production.

---

## Project structure

```
src/
├── actions/        # Server actions (auth, lessons, tests, SRS, AI, community)
├── app/            # Next.js App Router pages (landing, app, certificates)
├── components/     # UI primitives, test runner, speech hooks, AI panel, community
├── lib/            # Content (levels), DB client, types, utils
prisma/
├── schema.prisma   # Database models
└── seed.js         # Idempotent demo seed
```