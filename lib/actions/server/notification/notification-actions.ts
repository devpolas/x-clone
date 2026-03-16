"use server";

import { NotificationType } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma/prisma";
import { getSession } from "../auth/auth-actions";
import { revalidateTag, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Create a notification
 */
export async function createNotification(
  type: NotificationType,
  recipientId: string,
  actorId: string,
  tweetId?: string,
) {
  try {
    if (actorId === recipientId) return { success: true };

    const exitingNotification = await prisma.notification.findFirst({
      where: {
        type,
        recipientId,
        actorId,
        tweetId: tweetId || null,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    if (exitingNotification) return { success: true };

    await prisma.notification.create({
      data: { type, recipientId, actorId, tweetId },
    });

    // Revalidate cached notifications and unread count
    revalidateTag(`notifications-${recipientId}`, "max");
    revalidateTag(`notifications-count-${recipientId}`, "max");

    return { success: true };
  } catch (error) {
    console.error("failed to create notification", error);
    return { success: false, error: "failed to create notification" };
  }
}

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = unstable_cache(
  async (userId: string) => {
    const count = await prisma.notification.count({
      where: { recipientId: userId, read: false },
    });
    return { success: true, count };
  },
  ["notifications-count"],
  { revalidate: 30, tags: ["notifications-count"] },
);

/**
 * Mark all notifications as read
 */
export async function markAllNotificationRead() {
  const session = await getSession();
  if (!session?.user) redirect("/signin");
  const userId = session.user.id;

  try {
    await prisma.notification.updateMany({
      where: { recipientId: userId, read: false },
      data: { read: true },
    });

    // Revalidate caches
    revalidateTag(`notifications-${userId}`, "max");
    revalidateTag(`notifications-count-${userId}`, "max");

    return { success: true };
  } catch (error) {
    console.error("mark notifications read error", error);
    return { success: false, error: "failed to mark notifications as read" };
  }
}

/**
 * Get all notifications
 */
export const getNotifications = unstable_cache(
  async (userId: string) => {
    try {
      const notifications = await prisma.notification.findMany({
        where: { recipientId: userId },
        include: {
          actor: {
            select: { id: true, name: true, username: true, avatar: true },
          },
          tweet: {
            include: {
              author: {
                select: { id: true, name: true, username: true, avatar: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return { success: true, notifications };
    } catch (error) {
      console.error("notification fetching error", error);
      return { success: false, error: "notification fetching error" };
    }
  },
  ["notifications"],
  { revalidate: 60, tags: ["notifications"] },
);
