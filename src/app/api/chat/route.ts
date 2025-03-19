import { geminiProModel } from "@/ai";
import { saveChat } from "@/data-access/chats";
import { assertAuthenticated } from "@/lib/session";
import { convertToCoreMessages, Message, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
  const user = await assertAuthenticated();
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0
  );

  const r = await streamText({
    model: geminiProModel,
    messages: coreMessages,
    onFinish: async (result) => {
      console.log(result.response.messages);
      if (user && user.id) {
        console.log("if?");
        try {
          console.log("hello", {
            id,
            messages: [...coreMessages, ...result.response.messages],
            userId: user.id,
          });
          await saveChat({
            id,
            messages: [...coreMessages, ...result.response.messages],
            userId: user.id,
          });
        } catch (error) {
          console.error("Failed to save chat");
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return r.toDataStreamResponse({});
}
