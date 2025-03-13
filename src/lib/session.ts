"server only";

import { createSession, generateSessionToken, validateRequest } from "@/auth";
import { AuthenticationError } from "@/use-cases/errors";
import { UserId } from "@/use-cases/types";
import { cookies } from "next/headers";
import { cache } from "react";

const SESSION_COOKIE_NAME = "session";

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const allCookies = await cookies();
  allCookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const allCookies = await cookies();
  allCookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export const getCurrentUser = cache(async () => {
  const { user } = await validateRequest();
  return user ?? undefined;
});

export async function setSession(userId: UserId) {
  const token = generateSessionToken();
  const session = await createSession(token, userId);
  setSessionTokenCookie(token, session.expiresAt);
}

export async function getSessionToken(): Promise<string | undefined> {
  const allCookies = await cookies();
  const sessionCookie = allCookies.get(SESSION_COOKIE_NAME)?.value;
  return sessionCookie;
}

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};
