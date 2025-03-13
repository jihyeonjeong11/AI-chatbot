"use server";

import { rateLimitByKey } from "@/lib/limiter";
//import { createGroupUseCase } from "@/use-cases/groups";
import { schema } from "./validation";
import { revalidatePath } from "next/cache";
import { authenticatedAction } from "@/lib/safe-actions";
import { createGroupUseCase } from "@/use-cases/groups";

export const createGroupAction = authenticatedAction
  .createServerAction()
  .input(schema)
  .handler(async ({ input: { name, description }, ctx: { user } }) => {
    await rateLimitByKey({
      key: `${user.id}-create-group`,
    });
    await createGroupUseCase(user, {
      name,
      description,
    });
    revalidatePath("/dashboard");
  });
