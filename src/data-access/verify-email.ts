import { UserId } from "@/use-cases/types";
import { generateRandomToken } from "./utils";
import { TOKEN_LENGTH, TOKEN_TTL } from "@/app-config";
import { database } from "@/db";
import { verifyEmailTokens } from "@/db/schema";

export async function createVerifyEmailToken(userId: UserId) {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  await database
    .insert(verifyEmailTokens)
    .values({
      userId,
      token,
      tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: verifyEmailTokens.id,
      set: {
        token,
        tokenExpiresAt,
      },
    });

  return token;
}
