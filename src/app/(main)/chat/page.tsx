import { generateUUID } from "@/lib/utils";
import { ChatAreaSection } from "../(landing)/_sections/chat-area";
import { assertAuthenticated } from "@/lib/session";
import { getChatsByUserId } from "@/data-access/chats";
import { History } from "@/app/(main)/(landing)/_sections/history";

export default async function ChatPage() {
  const user = await assertAuthenticated();
  const id = generateUUID();
  const chats = await getChatsByUserId({ id: user.id });
  return (
    <>
      <ChatAreaSection key={user.id} id={id} initialMessages={[]} />
    </>
  );
}
