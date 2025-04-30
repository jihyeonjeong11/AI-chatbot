import {
  CoreMessage,
  CoreToolMessage,
  generateId,
  Message,
  ToolInvocation,
} from "ai";
import { notFound } from "next/navigation";
import { ChatAreaSection } from "../../(landing)/_sections/chat-area";
import { getChatById } from "@/data-access/chats";
import { assertAuthenticated } from "@/lib/session";
import { Chat } from "@/db/schema";
import { Metadata } from "next";
import { getTitleFromChat } from "../../(landing)/_sections/history";

function convertToUIMessages(messages: Array<CoreMessage>): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, message) => {
    if (message.role === "tool") {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = "";
    let toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === "string") {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === "text") {
          textContent += content.text;
        } else if (content.type === "tool-call") {
          toolInvocations.push({
            state: "call",
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    chatMessages.push({
      id: generateId(),
      role: message.role,
      content: textContent,
      toolInvocations,
    });

    return chatMessages;
  }, []);
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    notFound();
  }
  const title = getTitleFromChat(chatFromDb);

  return {
    title: `Chat with AI - ${title}`,
    description: "Access your personal AI chat session",
    openGraph: {
      title: `Chat with AI - ${id}`,
      description: "Access your personal AI chat session",
      url: `https://yourdomain.com/chat`,
      type: "website",
      // You can add dynamic images or other OG data here.
    },
    twitter: {
      card: "summary",
      title: `Chat with AI - ${title}`,
    },
  };
}

export default async function Page({ params }: any) {
  const _ = await assertAuthenticated();
  const { id } = params;
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    notFound();
  }

  // type casting and converting messages to UI messages
  const chat: Chat = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
  };

  return (
    <>
      <ChatAreaSection key={id} id={id} initialMessages={chat.messages} />
    </>
  );
}
function addToolMessageToChat(arg0: {
  toolMessage: CoreToolMessage;
  messages: Message[];
}): Message[] {
  throw new Error("Function not implemented.");
}
