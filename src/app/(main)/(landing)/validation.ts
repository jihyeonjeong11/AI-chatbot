import { z } from "zod";

export const schema = z.object({
  prompt: z.string().min(1),
});
