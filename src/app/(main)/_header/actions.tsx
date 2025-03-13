"use server";

import { invalidateSession, validateRequest } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function signOutAction() {
  const { session } = await validateRequest();

  if (!session) {
    redirect("/sign-in");
  }

  await invalidateSession(session.id);
  redirect("/signed-out");
}

export async function testAction() {
  console.log("fired");
  const apiKey = "AIzaSyBx3t9WaoNUKmx17TgcDN-GSGE8xEDe_B8";
  const requestBody = {
    contents: [
      {
        parts: [{ text: "Explain how AI works" }],
      },
    ],
  };
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  const data = await response.json();
  console.log(data);
}
