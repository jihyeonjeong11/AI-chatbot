import { getChatsByUserId } from "@/data-access/chats";
import { assertAuthenticated } from "@/lib/session";

export async function GET() {
  console.log("hello");
  const user = await assertAuthenticated();

  if (!user) {
    return Response.json("Unauthorized!", { status: 401 });
  }
  const chats = await getChatsByUserId({ id: user.id });
  return Response.json(chats);
}
