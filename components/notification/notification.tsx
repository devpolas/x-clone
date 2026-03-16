"use client";
import { Bell } from "lucide-react";
import { useNotification } from "./notification-context";
import { Badge } from "../ui/badge";
import { useEffect } from "react";
import { getUnreadNotificationCount } from "@/lib/actions/server/notification/notification-actions";

export function NotificationBadge({ userId }: { userId?: string }) {
  const { unreadCount, updateUnreadCount } = useNotification();

  useEffect(() => {
    async function fetchUnreadCount() {
      if (!userId) {
        return null;
      }
      const result = await getUnreadNotificationCount(userId);
      if (result.success) {
        updateUnreadCount(result.count || 0);
      }
    }
    fetchUnreadCount();
  }, []);

  return (
    <div className='relative'>
      <Bell className='mr-4 w-5 h-5' />
      {unreadCount > 0 && (
        <Badge
          variant={"destructive"}
          className='-top-2 left-0.5 absolute flex justify-center items-center p-0 rounded-full w-5 h-5 text-xs'
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </div>
  );
}
