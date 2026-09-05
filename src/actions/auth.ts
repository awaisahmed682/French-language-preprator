"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, setSessionCookie, clearSessionCookie, requireSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { safeStringify } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  targetLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).default("C1"),
  nativeLanguage: z.string().min(2).max(40).default("English"),
});

export type FormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values?: Record<string, string>;
};

export async function registerAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    targetLevel: formData.get("targetLevel") || "C1",
    nativeLanguage: formData.get("nativeLanguage") || "English",
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors,
      values: {
        name: String(raw.name || ""),
        email: String(raw.email || ""),
        targetLevel: String(raw.targetLevel || "C1"),
        nativeLanguage: String(raw.nativeLanguage || "English"),
      },
    };
  }

  const { name, email, password, targetLevel, nativeLanguage } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return { error: "An account with that email already exists. Try logging in.", values: {
      name, email, targetLevel, nativeLanguage,
    } };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
      currentLevel: "A1",
      targetLevel,
      nativeLanguage,
      progress: { create: { skillScores: safeStringify({}) } },
      gamification: { create: {} },
      aiHistory: { create: {} },
      community: { create: {} },
    },
  });

  await setSessionCookie(user.id);
  redirect("/dashboard");
}

export async function loginAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Enter both email and password." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await setSessionCookie(user.id);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/");
}

export async function setCurrentLevel(level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2") {
  const session = await requireSession();
  await prisma.user.update({
    where: { id: session.id },
    data: { currentLevel: level },
  });
}

export async function updateSettingsAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const { requireSession } = await import("@/lib/auth");
  const session = await requireSession();

  const name = String(formData.get("name") || "");
  const targetLevel = String(formData.get("targetLevel") || "C1") as
    | "A1"
    | "A2"
    | "B1"
    | "B2"
    | "C1"
    | "C2";
  const nativeLanguage = String(formData.get("nativeLanguage") || "English");

  if (name.trim().length < 2) {
    return { error: "Name must be at least 2 characters." };
  }

  await prisma.user.update({
    where: { id: session.id },
    data: { name: name.trim(), targetLevel, nativeLanguage },
  });

  return { ok: true };
}