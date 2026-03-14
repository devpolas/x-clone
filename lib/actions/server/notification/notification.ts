"use server";

import { NotificationType } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma/prisma";

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
