import { geminiProModel } from "@/ai";
import { convertToCoreMessages, Message, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
  const { messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0
  );
  const r = await streamText({
    model: geminiProModel,
    messages: coreMessages,
  });

  return r.toDataStreamResponse({});
}
