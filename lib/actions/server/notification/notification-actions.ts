"use server";

import { NotificationType } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma/prisma";
import { getSession } from "../auth/auth-actions";

export async function createNotification(
  type: NotificationType,
  recipientId: string,
  actorId: string,
  tweetId?: string,
) {
  try {
    if (actorId === recipientId) {
      return { success: true };
    }
    const exitingNotification = await prisma.notification.findFirst({
      where: {
        type,
        recipientId,
        actorId,
        tweetId: tweetId || null,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (exitingNotification) {
      return { success: true };
    }

    await prisma.notification.create({
      data: {
        type,
        recipientId,
        actorId,
        tweetId,
      },
    });
  } catch (error) {
    console.error("failed to create notification", error);
    return { success: false, error: "failed to create notification" };
  }
}

export async function getUnreadNotificationCount() {
  const session = await getSession();

  if (!session?.user) {
    return { success: true, count: 0 };
  }

  try {
    const count = await prisma.notification.count({
      where: {
        recipientId: session.user.id,
        read: false,
      },
    });

    return { success: true, count };
  } catch (error) {
    console.error("fetching notifications count error", error);
    return {
      success: false,
      error: "failed to fetch notification count error",
    };
  }
}
export async function markAllNotificationRead() {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, auth: false };
  }

  try {
    await prisma.notification.updateMany({
      where: {
        recipientId: session.user.id,
        read: false,
      },
      data: { read: true },
    });

    return { success: true };
  } catch (error) {
    console.error("fetching notifications mark as read error", error);
    return {
      success: false,
      error: "failed to fetch notification mark as read error",
    };
  }
}

export async function getNotifications() {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, auth: false };
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: session.user.id,
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
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
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, notifications };
  } catch (error) {
    console.error("fetching notifications error", error);
    return { success: false, error: "failed to fetch error" };
  }
}
