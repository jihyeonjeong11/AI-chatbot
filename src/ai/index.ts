import { google } from "@ai-sdk/google";
import { LanguageModelV1Middleware, wrapLanguageModel } from "ai";

const customMiddleware: LanguageModelV1Middleware = {};

export const geminiProModel = wrapLanguageModel({
  model: google("gemini-1.5-pro-002"),
  middleware: customMiddleware,
});

export const geminiFlashModel = wrapLanguageModel({
  model: google("gemini-1.5-flash-002"),
  middleware: customMiddleware,
});
