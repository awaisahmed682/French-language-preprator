import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import type { Level } from "./types";

const SESSION_COOKIE = "fp_session";
const getSecret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || process.env.AUTH_SECRET || "dev-secret");

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  currentLevel: Level;
  targetLevel: Level;
  nativeLanguage: string;
  createdAt: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.uid || typeof payload.uid !== "string") return null;
    const user = await prisma.user.findUnique({
      where: { id: payload.uid },
      select: {
        id: true,
        name: true,
        email: true,
        currentLevel: true,
        targetLevel: true,
        nativeLanguage: true,
        createdAt: true,
      },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      currentLevel: user.currentLevel as Level,
      targetLevel: user.targetLevel as Level,
      nativeLanguage: user.nativeLanguage,
      createdAt: user.createdAt.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string, remember = false): Promise<void> {
  const token = await signToken({ uid: userId });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}), // 30 days only when "remember me" is checked
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}