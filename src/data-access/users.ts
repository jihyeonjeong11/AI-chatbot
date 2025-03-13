import { database } from "@/db";
import {
  Profile,
  User,
  accounts,
  profiles,
  resetTokens,
  users,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { UserId } from "@/use-cases/types";
import { hashPassword } from "./utils";
import { getAccountByUserId } from "@/data-access/accounts";

export async function getUserByEmail(email: string) {
  const user = await database.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user;
}

export async function createUser(email: string) {
  const [user] = await database
    .insert(users)
    .values({
      email,
    })
    .returning();
  return user;
}

export async function verifyPassword(email: string, plainTextPassword: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return false;
  }

  const account = await getAccountByUserId(user.id);

  if (!account) {
    return false;
  }

  const salt = account.salt;
  const savedPassword = account.password;

  if (!salt || !savedPassword) {
    return false;
  }

  const hash = await hashPassword(plainTextPassword, salt);
  return account.password == hash;
}

export async function updateProfile(
  userId: UserId,
  updateProfile: Partial<Profile>
) {
  await database
    .update(profiles)
    .set(updateProfile)
    .where(eq(profiles.userId, userId));
}

export async function getPasswordResetToken(token: string) {
  const existingToken = await database.query.resetTokens.findFirst({
    where: eq(resetTokens.token, token),
  });

  return existingToken;
}

export async function deletePasswordResetToken(token: string, trx = database) {
  await trx.delete(resetTokens).where(eq(resetTokens.token, token));
}

export async function deleteUser(userId: UserId) {
  await database.delete(users).where(eq(users.id, userId));
}
