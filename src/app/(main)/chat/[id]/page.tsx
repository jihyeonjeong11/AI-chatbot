import { CoreMessage } from "ai";
import { notFound } from "next/navigation";
import { ChatAreaSection } from "../../(landing)/_sections/chat-area";
import { getChatById, getChatsByUserId } from "@/data-access/chats";
import { History } from "../../(landing)/_sections/history";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const chats = await getChatById({ id: id });

  return (
    <>
      <History />
      <ChatAreaSection key={id} id={id} initialMessages={[]} />
    </>
  );
}
