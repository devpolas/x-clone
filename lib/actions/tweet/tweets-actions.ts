"use server";

import prisma from "@/lib/prisma/prisma";
import { getSession } from "../server/auth-actions";
import { redirect } from "next/navigation";
import { TweetType } from "@/types/tweet";

export async function createTweet(content: string, imageUrl?: string) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin");
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
    redirect("/signin");
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
