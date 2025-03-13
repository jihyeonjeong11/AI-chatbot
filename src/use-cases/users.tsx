import {
  createUser,
  deletePasswordResetToken,
  deleteUser,
  getPasswordResetToken,
  getUserByEmail,
  updateProfile,
  verifyPassword,
} from "@/data-access/users";
import { LoginError, PublicError } from "./errors";
import { createAccount, updatePassword } from "@/data-access/accounts";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import { createProfile, getProfile } from "@/data-access/profiles";
import { UserId, UserSession } from "./types";
import { env } from "@/env";
import { createPasswordResetToken } from "@/data-access/reset-tokens";
import { redirect } from "next/navigation";
import { createTransaction, generateRandomToken } from "@/data-access/utils";
import { deleteSessionForUser } from "@/data-access/sessions";
import { applicationName, TOKEN_LENGTH, TOKEN_TTL } from "@/app-config";
import { VerifyEmail } from "@/emails/verify-emails";
import { database } from "@/db";
import { verifyEmailTokens } from "@/db/schema";
import { createVerifyEmailToken } from "@/data-access/verify-email";
import { ResetPasswordEmail } from "@/emails/reset-password";
import { sendEmail } from "@/lib/send-email";

export async function updateProfileNameUseCase(
  userId: UserId,
  displayName: string
) {
  await updateProfile(userId, { displayName });
}

export async function updateProfileBioUseCase(userId: UserId, bio: string) {
  await updateProfile(userId, { bio });
}

export function getProfileImageUrl(userId: UserId, imageId: string) {
  return `${env.HOST_NAME}/api/users/${userId}/images/${imageId ?? "default"}`;
}

export async function signInUseCase(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new LoginError();
  }

  const isPasswordCorrect = await verifyPassword(email, password);

  if (!isPasswordCorrect) {
    throw new LoginError();
  }

  return { id: user.id };
}

export async function registerUserUseCase(email: string, password: string) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new PublicError("An user with that email already exists.");
  }

  const user = await createUser(email);
  await createAccount(user.id, password);

  const displayName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: " ",
    style: "capital",
  });
  await createProfile(user.id, displayName);

  try {
    const token = await createVerifyEmailToken(user.id);
    await sendEmail(
      email,
      `Verify your email for ${applicationName}`,
      <VerifyEmail token={token} />
    );
  } catch (error) {
    console.error(
      "Verification email would not be sent, did you setup the resend API key?",
      error
    );
  }

  return { id: user.id };
}

export async function getUserProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId);

  if (!profile) {
    throw new PublicError("User not found");
  }

  return profile;
}

// export async function updateProfileNameUseCase(
//   userId: UserId,
//   displayName: string
// ) {
//   await updateProfile(userId, { displayName });
// }

export async function resetPasswordUseCase(email: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const token = await createPasswordResetToken(user.id);

  await sendEmail(
    email,
    `Your password reset link for ${applicationName}`,
    <ResetPasswordEmail token={token} />
  );
}

export async function deleteUserUseCase(
  authenticatedUser: UserSession,
  userToDeleteId: UserId
): Promise<void> {
  if (authenticatedUser.id !== userToDeleteId) {
    throw new PublicError("You can only delete your own account");
  }

  await deleteUser(userToDeleteId);
}

export async function changePasswordUseCase(token: string, password: string) {
  const tokenEntry = await getPasswordResetToken(token);

  if (!tokenEntry) {
    throw new PublicError("Invalid token");
  }

  const userId = tokenEntry.userId;

  await createTransaction(async (trx) => {
    await deletePasswordResetToken(token, trx);
    await updatePassword(userId, password, trx);
    await deleteSessionForUser(userId, trx);
  });
}
