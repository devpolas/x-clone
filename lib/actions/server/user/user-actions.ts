"use server";

import prisma from "@/lib/prisma/prisma";
import { getSession } from "../auth/auth-actions";
import { createNotification } from "../notification/notification-actions";
import { redirect } from "next/navigation";
import { revalidateTag, unstable_cache } from "next/cache";

/**
 * Fetch user profile with cached results
 */
export const getCachedUserProfile = unstable_cache(
  async (username: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          _count: {
            select: {
              tweets: true,
              likes: true,
              follower: true,
              following: true,
            },
          },
        },
      });
      if (!user) return { success: false, error: "user not found" };

      const [postedTweet, repliedTweet] = await Promise.all([
        prisma.tweet.count({ where: { authorId: user.id, parentId: null } }),
        prisma.tweet.count({
          where: { authorId: user.id, parentId: { not: null } },
        }),
      ]);

      return { success: true, user: { ...user, postedTweet, repliedTweet } };
    } catch (error) {
      console.error("profile fetching error", error);
      return { success: false, error: "failed to fetch user profile" };
    }
  },
  ["user-profile"],
  { revalidate: 180, tags: ["user-profile"] },
);

/**
 * Upload image to Cloudinary
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "x_clone");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) throw new Error("Failed to upload image");

  const data = await response.json();
  return data.secure_url;
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: {
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  banner?: string;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/signin");

  try {
    if (data.username !== session.user.username) {
      const exitingUsername = await prisma.user.findUnique({
        where: { username: data.username },
      });
      if (exitingUsername)
        return { success: false, error: "username is already taken" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        username: data.username,
        bio: data.bio,
        avatar: data.avatar,
        image: data.banner,
      },
    });

    // Revalidate caches
    revalidateTag("user-profile", "max");
    revalidateTag("user-tweets", "max");
    revalidateTag("user-replies", "max");
    revalidateTag("user-likes", "max");

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Profile update error", error);
    return { success: false, error: "failed to update profile", auth: false };
  }
}

/**
 * Fetch user's tweets
 */
export const getUserTweets = unstable_cache(
  async (username: string) => {
    try {
      const tweets = await prisma.tweet.findMany({
        where: { parentId: null, author: { username } },
        include: {
          author: {
            select: { id: true, name: true, username: true, avatar: true },
          },
          likes: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return { success: true, tweets };
    } catch (error) {
      console.error("fetch user tweets error", error);
      return { success: false, error: "fetch user tweets error" };
    }
  },
  ["user-tweets"],
  { revalidate: 120, tags: ["user-tweets"] },
);

/**
 * Fetch user's tweet replies
 */
export const getUserReplies = unstable_cache(
  async (username: string) => {
    try {
      const tweetsReplies = await prisma.tweet.findMany({
        where: { parentId: { not: null }, author: { username } },
        include: {
          author: {
            select: { id: true, name: true, username: true, avatar: true },
          },
          likes: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return { success: true, tweetsReplies };
    } catch (error) {
      console.error("fetch user replies error", error);
      return { success: false, error: "fetch user replies error" };
    }
  },
  ["user-replies"],
  { revalidate: 120, tags: ["user-replies"] },
);

/**
 * Fetch tweets liked by user
 */
export const getUserLikes = unstable_cache(
  async (username: string) => {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!user) return { success: false, error: "user not found" };

    const likes = await prisma.like.findMany({
      where: { userId: user.id },
      include: {
        tweet: {
          include: {
            author: {
              select: { id: true, name: true, username: true, avatar: true },
            },
            likes: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, tweet: likes.map((like) => like.tweet) };
  },
  ["user-likes"],
  { revalidate: 120, tags: ["user-likes"] },
);

/**
 * Follow or unfollow a user
 */
export async function followUser(targetUserId: string) {
  const session = await getSession();
  if (!session?.user) redirect("/signin");
  const userId = session.user.id;

  if (userId === targetUserId)
    return { success: false, error: "you can't follow yourself" };

  try {
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followingId_followerId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({ where: { id: existingFollow.id } });
      revalidateTag("user-profile", "max");
      return { success: true, action: "unfollow" };
    }

    await prisma.follow.create({
      data: { followerId: userId, followingId: targetUserId },
    });
    await createNotification("FOLLOW", targetUserId, userId);
    revalidateTag("user-profile", "max");

    return { success: true, action: "followed" };
  } catch (error) {
    console.error("error follow user", error);
    return { success: false, error: "failed to follow" };
  }
}

/**
 * Check if current user is following target user
 */
export async function checkFollowStatus(targetUserId: string) {
  const session = await getSession();
  if (!session?.user) redirect("/signin");

  try {
    const followStatus = await prisma.follow.findUnique({
      where: {
        followingId_followerId: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      },
    });
    return { success: true, isFollowing: !!followStatus };
  } catch (error) {
    console.error("failed to check follow status", error);
    return {
      success: false,
      error: "failed to check follow status",
      isFollowing: false,
    };
  }
}
