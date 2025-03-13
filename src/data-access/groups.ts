import { database } from "@/db";
import { Group, GroupId, groups, memberships, NewGroup } from "@/db/schema";
import { PublicError } from "@/use-cases/errors";
import { UserId, UserSession } from "@/use-cases/types";
import { omit } from "@/util/utils";
import { and, count, eq, ilike, sql } from "drizzle-orm";
import { getMembership } from "./memberships";

export async function getGroupsByMembership(userId: UserId) {
  const userMemberships = await database.query.memberships.findMany({
    where: eq(memberships.userId, userId),
    with: {
      group: {
        with: {
          memberships: true,
        },
      },
    },
  });

  return userMemberships.map((membership) => {
    const group = membership.group;
    return appendGroupMemberCount(group);
  });
}

export async function updateGroup(
  groupId: GroupId,
  updatedGroup: Partial<Group>
) {
  await database.update(groups).set(updatedGroup).where(eq(groups.id, groupId));
}

function appendGroupMemberCount<T extends { memberships: any[] }>(group: T) {
  return omit(
    {
      ...group,
      memberCount: group.memberships.length + 1,
    },
    "memberships"
  );
}

export async function getGroupById(groupId: GroupId) {
  return await database.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });
}

export async function countUserGroups(userId: UserId) {
  const [{ count: total }] = await database
    .select({ count: count() })
    .from(groups)
    .where(eq(groups.userId, userId));
  return total;
}

export async function createGroup(group: NewGroup) {
  await database.insert(groups).values(group);
}

export async function getGroupsByUser(userId: UserId) {
  const userGroups = await database.query.groups.findMany({
    where: eq(groups.userId, userId),
    with: {
      memberships: true,
    },
  });

  return userGroups.map(appendGroupMemberCount);
}

export async function searchPublicGroupsByName(search: string, page: number) {
  const GROUPS_PER_PAGE = 9;

  const condition = search
    ? and(eq(groups.isPublic, true), ilike(groups.name, `%${search}%`))
    : eq(groups.isPublic, true);

  const allGroups = await database.select().from(groups);

  const userMemberships = await database.query.groups.findMany({
    where: condition,
    with: {
      memberships: true,
    },
    limit: GROUPS_PER_PAGE,
    offset: (page - 1) * GROUPS_PER_PAGE,
  });

  const [countResult] = await database
    .select({
      count: sql`count(*)`.mapWith(Number).as("count"),
    })
    .from(groups)
    .where(condition);
  console.log(allGroups);
  console.log(userMemberships);

  return {
    data: userMemberships.map(appendGroupMemberCount),
    // allGroups
    //   .map((g) => ({ ...g, memberships: [1] }))
    //   .map(appendGroupMemberCount), //userMemberships.map(appendGroupMemberCount),
    total: countResult.count,
    perPage: GROUPS_PER_PAGE,
  };
}

export async function isAdminOrOwnerOfGroup(
  user: UserSession | undefined,
  groupId: GroupId
) {
  if (!user) {
    return false;
  }

  const membership = await getMembership(user.id, groupId);
  const group = await getGroupById(groupId);

  if (!group) {
    throw new PublicError("Group not found");
  }

  const isAdmin = membership?.role === "admin";
  const isOwner = group.userId === user.id;

  return isAdmin || isOwner;
}

//   export async function getGroupsByMembership(userId: UserId) {
//     const userMemberships = await database.query.memberships.findMany({
//       where: eq(memberships.userId, userId),
//       with: {
//         group: {
//           with: {
//             memberships: true,
//           },
//         },
//       },
//     });

//     return userMemberships.map((membership) => {
//       const group = membership.group;
//       return appendGroupMemberCount(group);
//     });
//   }
