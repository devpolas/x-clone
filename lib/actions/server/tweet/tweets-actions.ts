"use server";

import prisma from "@/lib/prisma/prisma";
import { getSession } from "../auth/auth-actions";
import { createNotification } from "../notification/notification";

export async function createTweet(content: string, imageUrl?: string) {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, auth: false };
  }

  try {
    const tweet = await prisma.tweet.create({
      data: {
        content,
        imageUrl,
        authorId: session.user.id,
      },
    });

    return { success: true, tweet };
  } catch (error) {
    console.error("error creating tweet", error);
    return { success: false, error: "failed to create tweet" };
  }
}

export async function createTweetReply(
  tweetId: string,
  content: string,
  imageUrl?: string,
) {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, auth: false };
  }

  try {
    const tweetReply = await prisma.tweet.create({
      data: {
        content,
        imageUrl,
        authorId: session.user.id,
        parentId: tweetId,
      },
    });

    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
      select: {
        authorId: true,
      },
    });

    if (tweet) {
      await createNotification(
        "REPLY",
        tweet.authorId,
        session.user.id,
        tweetId,
      );
    }

    return { success: true, tweetReply };
  } catch (error) {
    console.error("error creating tweet", error);
    return { success: false, error: "failed to create tweet reply" };
  }
}

export async function getTweetById(id: string) {
  try {
    const tweet = await prisma.tweet.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        likes: true,
      },
    });

    if (!tweet) {
      return { success: false, error: "tweet was not found" };
    }

    return { success: true, tweet };
  } catch (error) {
    console.error("error fetching tweet", error);
    return { success: false, error: "failed to fetch tweet" };
  }
}

export async function getTweetRepliesById(id: string) {
  try {
    const replies = await prisma.tweet.findMany({
      where: {
        OR: [
          { parentId: id },
          {
            parent: {
              parentId: id,
            },
          },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        likes: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { success: true, tweetReplies: replies };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch replies" };
  }
}

export async function getTweets() {
  try {
    const tweets = await prisma.tweet.findMany({
      where: { parentId: null },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, tweets };
  } catch (error) {
    console.error("error fetching tweets", error);
    return { success: false, error: "failed to fetch tweets" };
  }
}

export async function likeTweet(tweetId: string) {
  const session = await getSession();
  if (!session?.user) {
    return { success: false, auth: false };
  }

  try {
    const exitingLike = await prisma.like.findUnique({
      where: {
        userId_tweetId: {
          userId: session.user.id,
          tweetId,
        },
      },
    });

    if (exitingLike) {
      await prisma.like.delete({
        where: {
          id: exitingLike.id,
        },
      });
      return { success: true, action: "unLiked" };
    } else {
      await prisma.like.create({
        data: {
          userId: session.user.id,
          tweetId,
        },
      });

      // create notification
      const tweet = await prisma.tweet.findUnique({
        where: {
          id: tweetId,
        },
        select: {
          authorId: true,
        },
      });

      if (tweet) {
        await createNotification(
          "LIKE",
          tweet.authorId,
          session.user.id,
          tweetId,
        );
      }

      return { success: true, action: "liked" };
    }
  } catch (error) {
    console.error("failed to like and unLiked", error);
    return { success: false, error: "failed to liked" };
  }
}
