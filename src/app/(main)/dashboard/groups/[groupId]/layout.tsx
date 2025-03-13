import { ReactNode } from "react";
import { TabsSection } from "./tab-section";
import { pageWrapperStyles } from "@/styles/common";
import { getCurrentUser } from "@/lib/session";
import { getPublicGroupInfoByIdUseCase } from "@/use-cases/groups";
import { NotFoundError } from "@/app/(main)/utils";

export default async function GroupLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const groupIdInt = parseInt(groupId);
  const user = await getCurrentUser();

  const group = await getPublicGroupInfoByIdUseCase(groupIdInt);

  if (!group) {
    throw new NotFoundError("Group not found.");
  }

  // const isGroupVisibleToUser = await isGroupVisibleToUserUseCase(
  //   user,
  //   group.id
  // );

  // const isGroupOwner = user ? await isGroupOwnerUseCase(user, group.id) : false;

  // if (!isGroupVisibleToUser) {
  //   throw new PrivateGroupAccessError();
  // }

  return (
    <div>
      <TabsSection groupId={groupId} showSettings={true} />

      <div className={pageWrapperStyles}>{children}</div>
    </div>
  );
}
