import { geminiProModel } from "@/ai";
import { deleteChatById, getChatById, saveChat } from "@/data-access/chats";
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
        try {
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

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const user = await assertAuthenticated();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
