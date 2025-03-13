import { Group, GroupId } from "@/db/schema";
import { UserSession } from "./types";
import { AuthenticationError } from "./errors";
import { getGroupById } from "@/data-access/groups";
import { NotFoundError } from "@/app/(main)/utils";
import { getMembership } from "@/data-access/memberships";

function isGroupOwner(user: UserSession, group: Group) {
  return user.id === group.userId;
}

export async function assertGroupMember(
  user: UserSession | undefined,
  groupId: GroupId
) {
  const group = await getGroupById(groupId);

  if (!group) {
    throw new NotFoundError("Group not found");
  }

  if (!user) {
    throw new AuthenticationError();
  }

  const membership = await getMembership(user.id, groupId);
  const isGroupOwner = group.userId === user.id;

  if (!membership && !isGroupOwner) {
    throw new AuthenticationError();
  }

  return group;
}

export async function assertGroupOwner(
  user: UserSession | undefined,
  groupId: GroupId
) {
  const group = await getGroupById(groupId);

  if (!group) {
    throw new NotFoundError("Group not found");
  }

  if (!user) {
    throw new AuthenticationError();
  }

  if (!isGroupOwner(user, group)) {
    throw new AuthenticationError();
  }

  return group;
}
