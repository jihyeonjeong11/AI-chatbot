import { TOKEN_LENGTH, TOKEN_TTL } from "@/app-config";
import { generateRandomToken } from "./utils";
import { UserId } from "@/use-cases/types";
import { database } from "@/db";
import { resetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createPasswordResetToken(userId: UserId) {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  await database
    .insert(resetTokens)
    .values({
      userId,
      token,
      tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: resetTokens.userId,
      set: {
        token,
        tokenExpiresAt,
      },
    });

  return token;
}

export async function deletePasswordResetToken(token: string, trx = database) {
  await trx.delete(resetTokens).where(eq(resetTokens.token, token));
}
