import { PrismaClient } from "@prisma/client";
import {
  users,
  servers,
  channelMessages,
  dmConversations,
  friendRequests,
  friendIds,
  CURRENT_USER_ID,
} from "../src/lib/ribbon/mock-data";

const db = new PrismaClient();

async function main() {
  // Reset in foreign-key-safe order so the seed can be re-run cleanly.
  await db.reaction.deleteMany();
  await db.message.deleteMany();
  await db.directMessage.deleteMany();
  await db.friendRequest.deleteMany();
  await db.serverMember.deleteMany();
  await db.channel.deleteMany();
  await db.server.deleteMany();
  await db.user.deleteMany();

  // Users — keep handles unique even if the mock data ever collides.
  const userIds = new Set<string>();
  const usedHandles = new Set<string>();
  for (const u of Object.values(users)) {
    let handle = u.handle || u.id;
    if (usedHandles.has(handle)) handle = `${handle}-${u.id}`;
    usedHandles.add(handle);

    await db.user.create({
      data: {
        id: u.id,
        username: u.username,
        handle,
        avatarLetter: u.avatarLetter ?? null,
        accent: u.accent,
        status: u.status,
        customTag: u.customTag ?? null,
        bio: u.bio ?? null,
        pronouns: u.pronouns ?? null,
        location: u.location ?? null,
        verified: u.verified ?? false,
      },
    });
    userIds.add(u.id);
  }

  // Servers, their channels, and their members.
  for (const s of Object.values(servers)) {
    const ownerMember = s.members?.find(
      (m) => m.role === "owner" && userIds.has(m.userId),
    );
    const ownerId = ownerMember?.userId ?? CURRENT_USER_ID;

    await db.server.create({
      data: {
        id: s.id,
        name: s.name,
        letter: s.letter ?? null,
        accent: s.accent,
        description: s.description ?? null,
        isPublic: s.isPublic,
        category: s.category ?? null,
        ownerId,
      },
    });

    if (s.channels?.length) {
      await db.channel.createMany({
        data: s.channels.map((c, i) => ({
          id: c.id,
          serverId: s.id,
          name: c.name,
          type: c.type,
          topic: c.topic ?? null,
          position: i,
        })),
        skipDuplicates: true,
      });
    }

    if (s.members?.length) {
      await db.serverMember.createMany({
        data: s.members
          .filter((m) => userIds.has(m.userId))
          .map((m) => ({
            serverId: s.id,
            userId: m.userId,
            role: m.role,
            nickname: m.nickname ?? null,
          })),
        skipDuplicates: true,
      });
    }
  }

  // Channel messages (only for channels and authors that exist).
  const channelIds = new Set(
    (await db.channel.findMany({ select: { id: true } })).map((c) => c.id),
  );
  for (const [channelId, msgs] of Object.entries(channelMessages)) {
    if (!channelIds.has(channelId)) continue;
    const data = msgs
      .filter((m) => userIds.has(m.authorId))
      .map((m) => ({ channelId, authorId: m.authorId, text: m.content.text }));
    if (data.length) await db.message.createMany({ data });
  }

  // Direct messages — sender/recipient derived from each message's owner flag.
  for (const dm of dmConversations) {
    if (!userIds.has(dm.otherUserId)) continue;
    const data = dm.messages.map((m) => {
      const own = m.isOwn || m.authorId === CURRENT_USER_ID;
      return {
        fromId: own ? CURRENT_USER_ID : dm.otherUserId,
        toId: own ? dm.otherUserId : CURRENT_USER_ID,
        text: m.content.text,
        read: dm.unread === 0,
      };
    });
    if (data.length) await db.directMessage.createMany({ data });
  }

  // Friendships (accepted) + pending friend requests.
  const requests: { fromId: string; toId: string; status: string }[] = [];
  for (const fid of friendIds) {
    if (userIds.has(fid)) {
      requests.push({ fromId: CURRENT_USER_ID, toId: fid, status: "accepted" });
    }
  }
  for (const r of friendRequests) {
    if (!userIds.has(r.userId)) continue;
    const incoming = r.direction === "incoming";
    requests.push({
      fromId: incoming ? r.userId : CURRENT_USER_ID,
      toId: incoming ? CURRENT_USER_ID : r.userId,
      status: "pending",
    });
  }
  if (requests.length) {
    await db.friendRequest.createMany({ data: requests, skipDuplicates: true });
  }

  const [u, sv, ch, msg, dmCount] = await Promise.all([
    db.user.count(),
    db.server.count(),
    db.channel.count(),
    db.message.count(),
    db.directMessage.count(),
  ]);
  console.log(
    `Seeded ${u} users, ${sv} servers, ${ch} channels, ${msg} messages, ${dmCount} DMs.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
