"use server";

import prisma from "@/lib/prisma/prisma";

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
