"use client";

import { useEffect } from "react";
import { useNotification } from "./notification-context";
import { markAllNotificationRead } from "@/lib/actions/server/notification/notification-actions";

export default function NotificationObserver() {
  const { markAllAsRead } = useNotification();
  useEffect(() => {
    async function markAsRead() {
      await markAllNotificationRead();
    }

    markAsRead();
  }, [markAllAsRead]);
  return <></>;
}
