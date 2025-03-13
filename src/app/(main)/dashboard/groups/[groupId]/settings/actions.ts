"use server";

import { authenticatedAction } from "@/lib/safe-actions";

import { toggleGroupVisibilityUseCase } from "@/use-cases/groups";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const toggleGroupVisibilityAction = authenticatedAction
  .createServerAction()
  .input(z.number())
  .handler(async ({ input: groupId, ctx: { user } }) => {
    await toggleGroupVisibilityUseCase(user, groupId);
    revalidatePath(`/dashboard/groups/${groupId}/settings`);
  });
