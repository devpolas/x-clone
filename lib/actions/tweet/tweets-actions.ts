"use server";

import prisma from "@/lib/prisma/prisma";
import { getSession } from "../server/auth-actions";
import { redirect } from "next/navigation";

export async function createTweet(content: string) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin");
  }

  try {
    const tweet = await prisma.tweet.create({
      data: {
        content,
        imageUrl: null,
        authorId: session.user.id,
      },
    });

    return { success: true, tweet };
  } catch (error) {
    console.error("error creating tweet", error);
    return { success: false, error: "failed to create tweet" };
  }
}

export async function getTweets() {
  try {
    const tweets = await prisma.tweet.findMany({
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
