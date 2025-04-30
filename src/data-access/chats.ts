import { database } from "@/db";
import { Chat, chat } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getChatsByUserId({ id }: { id: number }) {
  try {
    return await database
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: number;
}) {
  try {
    const selectedChats = await database
      .select()
      .from(chat)
      .where(eq(chat.id, id));

    if (selectedChats.length > 0) {
      return await database
        .update(chat)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chat.id, id));
    }

    return await database.insert(chat).values({
      id,
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await database.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await database
      .select()
      .from(chat)
      .where(eq(chat.id, id));
    return selectedChat as Chat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function getChat({ id }: { id: string }) {
  const foundChat = await database.query.chat.findFirst({
    where: eq(chat?.id, id),
  });

  return foundChat;

  // const user = await database.query.users.findFirst({
  //   where: eq(users.email, email),
  // });

  // return user;
}
