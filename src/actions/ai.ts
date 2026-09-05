"use server";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLevelContent, LEVEL_CONTENT_LIST } from "@/lib/content";
import { parseJson, safeStringify } from "@/lib/utils";
import type { Level } from "@/lib/types";

const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";
const AI_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(messages: { role: "system" | "user" | "assistant"; content: string }[]) {
  if (!AI_KEY) return null;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages,
      temperature: 0.7,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? null;
}

async function persistHistory(
  userId: string,
  kind: "roleplay" | "explanation" | "tutor",
  entry: unknown
) {
  const record = await prisma.aiHistory.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
  const key =
    kind === "roleplay" ? "roleplaySessions" : kind === "explanation" ? "explanations" : "tutorConversations";
  const list = parseJson<unknown[]>(record[key] as string, []);
  list.unshift(entry);
  await prisma.aiHistory.update({
    where: { id: record.id },
    data: { [key]: safeStringify(list.slice(0, 30)) },
  });
}

export async function roleplayReply(
  level: Level,
  scenarioId: string,
  userMessage: string
): Promise<{ reply: string; speaker?: string; done?: boolean }> {
  const user = await requireSession();
  const content = getLevelContent(level);
  const scenario = content.scenarios.find((s) => s.id === scenarioId);

  if (AI_KEY) {
    const ai = await callOpenAI([
      {
        role: "system",
        content: `Tu es un partenaire de jeu de rôle en français, niveau ${level}. Continue la conversation de façon naturelle et enregistre l'utilisateur. Réponds en 1-2 phrases en français.`,
      },
      { role: "user", content: userMessage },
    ]);
    if (ai) {
      await persistHistory(user.id, "roleplay", {
        level,
        scenarioId,
        userMessage,
        reply: ai,
        date: new Date().toISOString(),
      });
      return { reply: ai };
    }
  }

  if (!scenario) {
    const generic = `Très bien ! Continuez : parlez-moi en français (niveau ${level}), ou dites « aide » pour un indice.`;
    return { reply: generic };
  }

  const idx = Math.floor(Math.random() * scenario.dialogue.length);
  const line = scenario.dialogue[idx];
  await persistHistory(user.id, "roleplay", {
    level,
    scenarioId,
    userMessage,
    reply: line.text,
    date: new Date().toISOString(),
  });
  return { reply: line.text, speaker: line.speaker };
}

export async function explainTopic(level: Level, query: string) {
  const user = await requireSession();
  const content = getLevelContent(level);
  const normalized = query.toLowerCase();

  const topic =
    content.grammar.find(
      (t) => normalized.includes(t.title.toLowerCase()) || normalized.includes(t.id.toLowerCase())
    ) ??
    content.grammar.find((t) =>
      t.title
        .toLowerCase()
        .split(/\s+/)
        .some((word) => word.length > 3 && normalized.includes(word))
    );

  if (AI_KEY) {
    const ai = await callOpenAI([
      {
        role: "system",
        content: `Tu es un professeur de français, niveau ${level}. Explique clairement avec un exemple. Réponds en français.`,
      },
      { role: "user", content: query },
    ]);
    if (ai) {
      await persistHistory(user.id, "explanation", {
        level,
        query,
        reply: ai,
        date: new Date().toISOString(),
      });
      return { reply: ai, source: "ai" };
    }
  }

  if (!topic) {
    const pick = REVIEW_TOPICS_INDEX[level] ?? [];

    return {
      reply: `Je ne suis pas tout à fait sûr d'avoir un point exact sur ce sujet (${level}). Essayez l'un de ces points : ${pick.join(" • ")}.`,
      source: "rules" as const,
    };
  }

  const explanation = topic.examples
    .slice(0, 2)
    .map((e) => `${e.fr} = ${e.en}`)
    .join(" | ");
  await persistHistory(user.id, "explanation", {
    level,
    query,
    reply: topic.explanation,
    date: new Date().toISOString(),
  });
  return {
    reply: `${topic.title}\n\n${topic.explanation}\n\nExemples : ${explanation}`,
    source: "rules" as const,
  };
}

const REVIEW_TOPICS_INDEX: Record<Level, string[]> = {
  A1: ["Articles et pluriel", "Verbes en -er", "Se présenter", "La négation"],
  A2: ["Passé composé", "Imparfait", "Pronoms objets", "Impératif"],
  B1: ["Subjonctif", "Conditionnel présent", "Futur simple", "Discours indirect"],
  B2: ["Subjonctif passé", "Conditionnel passé", "Passif", "Articulateurs"],
  C1: ["Passé simple", "Inversion", "Accord du participe", "Registres de langue"],
  C2: ["Temps littéraires", "Concordance des temps", "Figures de style", "Registre soutenu"],
};

export async function tutorChat(level: Level, message: string) {
  const user = await requireSession();
  const allContent = LEVEL_CONTENT_LIST;

  if (AI_KEY) {
    const ai = await callOpenAI([
      {
        role: "system",
        content: `Tu es un tuteur bienveillant de français pour un apprenant de niveau ${level}. Corrige les fautes avec tact, explique brièvement, et pose une question pour continuer.`,
      },
      ...historyMessages(level),
      { role: "user", content: message },
    ]);
    if (ai) {
      await persistHistory(user.id, "tutor", {
        level,
        message,
        reply: ai,
        date: new Date().toISOString(),
      });
      return { reply: ai, source: "ai" as const };
    }
  }

  const lower = message.toLowerCase();
  let reply: string;
  if (lower.includes("bonjour") || lower.trim() === "") {
    reply = `Bonjour ! Je suis votre tuteur de français (niveau ${level}). Écrivez une phrase en français : je vous corrigerai et vous expliquerai.`;
  } else if (lower.includes("merci")) {
    reply = "Avec plaisir ! Continuez à pratiquer régulièrement. Quelle est la prochaine phrase ?";
  } else if (/(comment|pourquoi|quand|explication|règle)/.test(lower)) {
    const topics = allContent.map((c) => c.grammar.map((t) => t.title)).flat();
    reply = `Bonne question ! Parmi les points couverts à votre niveau, on trouve par exemple : ${topics.slice(0, 6).join(" • ")}. Dites-moi lequel vous voulez approfondir, ou utilisez l'onglet « Explications ».`;
  } else {
    reply = `Merci ! Voici une remarque : relisez l'accord du verbe et du sujet. \nUne phrase bien construite : « ${capitalize(trimMessage(message))} ».\nContinuez en écrivant une autre phrase.`;
  }

  await persistHistory(user.id, "tutor", {
    level,
    message,
    reply,
    date: new Date().toISOString(),
  });
  return { reply, source: "rules" as const };
}

function historyMessages(level: Level) {
  return [
    {
      role: "system" as const,
      content: `L'apprenant est de niveau ${level}. Garde les conseils courts et encourageants.`,
    },
  ];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function trimMessage(s: string): string {
  return s.trim().replace(/\.+$/, ".").replace(/\s+/g, " ");
}

export async function aiSessionCounts() {
  const user = await requireSession();
  const record = await prisma.aiHistory.findUnique({ where: { userId: user.id } });
  if (!record) return { roleplay: 0, explanations: 0, tutor: 0 };
  return {
    roleplay: parseJson<unknown[]>(record.roleplaySessions, []).length,
    explanations: parseJson<unknown[]>(record.explanations, []).length,
    tutor: parseJson<unknown[]>(record.tutorConversations, []).length,
  };
}