"use client";

import React, { useContext, useState } from "react";

interface NotificationContextType {
  unreadCount: number;
  updateUnreadCount: (count: number) => void;
  markAllAsRead: () => void;
}

const NotificationContext = React.createContext<NotificationContextType | null>(
  null,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadCount, setUnreadCount] = useState(0);

  function updateUnreadCount(count: number) {
    setUnreadCount(count);
  }

  function markAllAsRead() {
    setUnreadCount(0);
  }

  return (
    <NotificationContext.Provider
      value={{ unreadCount, updateUnreadCount, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }

  return context;
}
