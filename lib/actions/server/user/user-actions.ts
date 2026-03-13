"use server";

import prisma from "@/lib/prisma/prisma";

export async function getUserProfile(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        _count: {
          select: {
            tweets: true,
            likes: true,
          },
        },
      },
    });
    if (!user) {
      return { success: false, error: "user not found" };
    }

    const [postedTweet, repliedTweet] = await Promise.all([
      prisma.tweet.count({
        where: {
          authorId: user.id,
          parentId: null,
        },
      }),
      prisma.tweet.count({
        where: {
          authorId: user.id,
          parentId: { not: null },
        },
      }),
    ]);

    return {
      success: true,
      user: {
        ...user,
        postedTweet,
        repliedTweet,
      },
    };
  } catch (error) {
    console.error("profile fetching error", error);
    return { success: false, error: "failed to fetching user profile" };
  }
}
