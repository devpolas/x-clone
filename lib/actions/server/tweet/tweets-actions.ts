"use server";

import prisma from "@/lib/prisma/prisma";
import { getSession } from "../auth/auth-actions";
import { createNotification } from "../notification/notification-actions";
import { redirect } from "next/navigation";
import { revalidateTag, unstable_cache } from "next/cache";

/**
 * Create a new tweet
 */
export async function createTweet(content: string, imageUrl?: string) {
  const session = await getSession();
  if (!session?.user) redirect("/signin");

  try {
    const tweet = await prisma.tweet.create({
      data: { content, imageUrl, authorId: session.user.id },
    });

    revalidateTag("timeline-tweets", "max");

    return { success: true, tweet };
  } catch (error) {
    console.error("error creating tweet", error);
    return { success: false, error: "failed to create tweet" };
  }
}

/**
 * Reply to a tweet
 */
export async function createTweetReply(
  tweetId: string,
  content: string,
  imageUrl?: string,
) {
  const session = await getSession();
  if (!session?.user) redirect("/signin");

  try {
    const tweetReply = await prisma.tweet.create({
      data: { content, imageUrl, authorId: session.user.id, parentId: tweetId },
    });

    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
      select: { authorId: true },
    });

    if (tweet) {
      await createNotification(
        "REPLY",
        tweet.authorId,
        session.user.id,
        tweetId,
      );
    }

    revalidateTag("tweet", "max");
    revalidateTag("tweet-replies", "max");

    return { success: true, tweetReply };
  } catch (error) {
    console.error("error creating tweet reply", error);
    return { success: false, error: "failed to create tweet reply" };
  }
}

/**
 * Fetch a tweet by ID (cached)
 */
export const getTweetById = unstable_cache(
  async (id: string) => {
    const tweet = await prisma.tweet.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        likes: true,
      },
    });

    if (!tweet) return { success: false, error: "tweet was not found" };
    return { success: true, tweet };
  },
  ["tweet-by-id"],
  { revalidate: 120, tags: ["tweet"] },
);

/**
 * Fetch replies to a tweet (cached)
 */
export const getTweetRepliesById = unstable_cache(
  async (id: string) => {
    const replies = await prisma.tweet.findMany({
      where: {
        OR: [{ parentId: id }, { parent: { parentId: id } }],
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        likes: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return { success: true, tweetReplies: replies };
  },
  ["tweet-replies"],
  { revalidate: 120, tags: ["tweet-replies"] },
);

/**
 * Fetch timeline tweets (cached)
 */
export const getTweets = unstable_cache(
  async () => {
    const tweets = await prisma.tweet.findMany({
      where: { parentId: null },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        likes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, tweets };
  },
  ["timeline-tweets"],
  { revalidate: 60, tags: ["timeline-tweets"] },
);

/**
 * Like or unlike a tweet
 */
export async function likeTweet(tweetId: string) {
  const session = await getSession();
  if (!session?.user) redirect("/signin");

  try {
    const existingLike = await prisma.like.findUnique({
      where: { userId_tweetId: { userId: session.user.id, tweetId } },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      revalidateTag("tweet", "max");
      revalidateTag("timeline-tweets", "max");
      return { success: true, action: "unLiked" };
    }

    await prisma.like.create({ data: { userId: session.user.id, tweetId } });

    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
      select: { authorId: true },
    });
    if (tweet)
      await createNotification(
        "LIKE",
        tweet.authorId,
        session.user.id,
        tweetId,
      );

    revalidateTag("tweet", "max");
    revalidateTag("timeline-tweets", "max");
    return { success: true, action: "liked" };
  } catch (error) {
    console.error("failed to like/unlike tweet", error);
    return { success: false, error: "failed to like tweet", auth: false };
  }
}
