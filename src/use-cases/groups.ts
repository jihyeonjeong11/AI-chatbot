import {
  countUserGroups,
  createGroup,
  getGroupById,
  getGroupsByMembership,
  getGroupsByUser,
  isAdminOrOwnerOfGroup,
  searchPublicGroupsByName,
  updateGroup,
} from "@/data-access/groups";
import { UserSession } from "./types";
import { PublicError } from "./errors";
import { getSubscription } from "@/data-access/subscriptions";
import { MAX_GROUP_LIMIT, MAX_GROUP_PREMIUM_LIMIT } from "@/app-config";
import { getSubscriptionPlan } from "./subscriptions";
import { omit } from "@/util/utils";
import { GroupId } from "@/db/schema";
import { assertGroupMember, assertGroupOwner } from "./authorization";

export async function getGroupsByUserUseCase(authenticatedUser: UserSession) {
  return [
    ...(await getGroupsByUser(authenticatedUser.id)),
    ...(await getGroupsByMembership(authenticatedUser.id)),
  ];
}

export async function updateGroupInfoUseCase(
  authenticatedUser: UserSession,
  {
    groupId,
    info,
  }: {
    groupId: GroupId;
    info: string;
  }
) {
  await assertGroupOwner(authenticatedUser, groupId);
  await updateGroup(groupId, { info });
}

export async function toggleGroupVisibilityUseCase(
  authenticatedUser: UserSession,
  groupId: GroupId
) {
  const group = await assertGroupOwner(authenticatedUser, groupId);

  await updateGroup(groupId, {
    isPublic: !group.isPublic,
  });
}

export async function createGroupUseCase(
  authenticatedUser: UserSession,
  newGroup: {
    name: string;
    description: string;
  }
) {
  const numberOfGroups = await countUserGroups(authenticatedUser.id);

  const subscription = await getSubscription(authenticatedUser.id);
  const plan = getSubscriptionPlan(subscription);

  if (
    numberOfGroups >=
    (plan === "premium" ? MAX_GROUP_PREMIUM_LIMIT : MAX_GROUP_LIMIT)
  ) {
    throw new PublicError("You have reached the maximum number of groups");
  }

  await createGroup({ ...newGroup, userId: authenticatedUser.id });
}

export async function getGroupByIdUseCase(
  authenticatedUser: UserSession,
  groupId: GroupId
) {
  await assertGroupMember(authenticatedUser, groupId);
  return await getGroupById(groupId);
}

export async function searchPublicGroupsUseCase(search: string, page: number) {
  return await searchPublicGroupsByName(search, page);
}

export async function getPublicGroupInfoByIdUseCase(groupId: GroupId) {
  const group = await getGroupById(groupId);
  if (!group) return undefined;
  return omit(group, "userId");
}

export async function isAdminOrOwnerOfGroupUseCase(
  authenticatedUser: UserSession | undefined,
  groupId: GroupId
) {
  return isAdminOrOwnerOfGroup(authenticatedUser, groupId);
}
