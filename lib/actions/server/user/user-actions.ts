"use server";

import prisma from "@/lib/prisma/prisma";
import { getSession } from "../auth/auth-actions";

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

export async function uploadImageToCloudinary(file: File): Promise<string> {
  let imageUrl: string | undefined;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "x_clone");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  return data.secure_url;
}

export async function updateUserProfile(data: {
  name: string;
  username: string;
  bio?: string;
  avatar?: string | undefined;
  banner?: string | undefined;
}) {
  const session = await getSession();
  if (!session?.user) {
    return { success: false, auth: false };
  }
  try {
    if (data.username !== session.user.username) {
      const exitingUsername = await prisma.user.findUnique({
        where: {
          username: data.username,
        },
      });
      if (exitingUsername) {
        return { success: false, error: "username is already taken" };
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
        username: data.username,
        bio: data.bio,
        avatar: data.avatar,
        image: data.banner, // using image field for banner
      },
    });
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Profile update error", error);
    return { success: false, error: "failed to update profile" };
  }
}

export async function getUserTweets(username: string) {
  try {
    const tweets = await prisma.tweet.findMany({
      where: {
        parentId: null,
        author: {
          username,
        },
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
        createdAt: "desc",
      },
    });

    return { success: true, tweets };
  } catch (error) {
    console.error("error fetching tweets", error);
    return { success: false, error: "failed to fetch tweets" };
  }
}

export async function getUserReplies(username: string) {
  try {
    const tweetsReplies = await prisma.tweet.findMany({
      where: {
        parentId: { not: null },
        author: {
          username,
        },
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
        createdAt: "desc",
      },
    });

    return { success: true, tweetsReplies };
  } catch (error) {
    console.error("error fetching tweets replies", error);
    return { success: false, error: "failed to fetch tweets replies" };
  }
}

export async function getUserLikes(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "user not found" };
    }

    const userLiedTweets = await prisma.like.findMany({
      where: {
        userId: user.id,
      },

      include: {
        tweet: {
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, tweet: userLiedTweets.map((like) => like.tweet) };
  } catch (error) {
    console.error("error fetching user tweets liked", error);
    return { success: false, error: "failed to fetch user tweets liked" };
  }
}
