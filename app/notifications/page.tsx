import MainLayout from "@/layouts/main-layout";
import { getNotifications } from "@/lib/actions/server/notification/notification-actions";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { NotificationType } from "../generated/prisma/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import Link from "next/link";
import { formatTimeAgo } from "@/utils/formate-date";
import NotificationObserver from "@/components/notification/notification-observer";

export default async function NotificationPage() {
  const result = await getNotifications();

  if (!result.success) {
    return (
      <div className='flex flex-col justify-center items-center h-64'>
        <p className='text-muted-foreground'>Failed to load notifications</p>
      </div>
    );
  }

  const notifications = result.notifications;

  function getNotificationIcon(type: NotificationType) {
    switch (type) {
      case "LIKE":
        return <Heart className='w-5 h-5 text-red-500' />;
      case "REPLY":
        return <MessageCircle className='w-5 h-5 text-blue-500' />;
      case "FOLLOW":
        return <UserPlus className='w-5 h-5 text-purple-500' />;
      default:
        return <Heart className='w-5 h-5 text-red-500' />;
    }
  }
  function getNotificationText(type: NotificationType, actorName: string) {
    switch (type) {
      case "LIKE":
        return `${actorName} liked your tweet`;
      case "REPLY":
        return `${actorName} replied your tweet`;
      case "FOLLOW":
        return `${actorName} following you`;
      default:
        return `${actorName} liked your tweet`;
    }
  }

  return (
    <MainLayout>
      <NotificationObserver />
      <div className='top-0 z-50 sticky bg-background/80 backdrop-blur-sm p-4 border-border border-b'>
        <h1 className='font-bold text-xl'>Notifications</h1>
      </div>
      {notifications?.length === 0 ? (
        <div className='flex flex-col justify-center items-center h-64 text-center'>
          <div className='justify-center items-center bg-muted mb-4 rounded-full w-16 h-16 fex'>
            <Heart className='w-8 h-8 text-muted-foreground' />
          </div>
          <h2 className='mb-2 font-semibold text-xl'>No Notification yet</h2>
          <p className='text-muted-foreground'>
            When someone likes or replies to your tweets, you&apos;ll see
          </p>
        </div>
      ) : (
        <div className='divide-y divide-border'>
          {notifications?.map((notification, key) => (
            <div
              key={key}
              className={`p-4 hover:bg-muted/50 transition-colors ${notification.read ? "bg-blue-50/50" : ""}`}
            >
              <div className='flex items-start space-x-3'>
                <div className='shrink-0'>
                  {getNotificationIcon(notification.type)}
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-start space-x-2'>
                    <Avatar className='w-10 h-10'>
                      <AvatarImage src={notification.actor.avatar ?? ""} />
                      <AvatarFallback>
                        {getInitials(notification.actor.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className='flex-1'>
                      <p className='text-sm'>
                        <Link
                          href={`/profile/${notification.actor.username}`}
                          className='font-semibold hover:underline'
                        >
                          {notification.actor.name}
                        </Link>{" "}
                        <span className='text-muted-foreground'>
                          {getNotificationText(
                            notification.type,
                            notification.actor.name,
                          )}
                        </span>
                      </p>
                      <p className='mt-1 text-muted-foreground text-xs'>
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  {notification.tweet && (
                    <div className='mt-3 ml-10'>
                      <div className='bg-muted/50 p-3 rounded-lg'>
                        <div className='flex items-center space-x-2 mb-2'>
                          <Avatar className='w-6 h-6'>
                            <AvatarImage
                              src={notification.tweet.author.avatar ?? ""}
                            />
                            <AvatarFallback>
                              {getInitials(notification.actor.name)}
                            </AvatarFallback>
                          </Avatar>
                          <Link
                            href={`/profile/${notification.tweet.author.username}`}
                            className='font-semibold hover:underline'
                          >
                            {notification.tweet.author.name}
                          </Link>
                          <span className='text-muted-foreground text-xs'>
                            {notification.tweet.author.username}
                          </span>
                        </div>
                        <p className='text-muted-foreground text-sm line-clamp-3'>
                          {notification.tweet.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
