"use client";
import { CldImage } from "next-cloudinary";
import { TweetAuthor } from "../../types/tweet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { Button } from "../ui/button";
import { Calendar, Edit } from "lucide-react";

import { formatDate } from "@/utils/formate-date";
import { useState } from "react";
import ProfileModel from "./profile-model";
import { toast } from "sonner";
import { followUser } from "@/lib/actions/server/user/user-actions";
import { useRouter } from "next/navigation";
import Loader from "../loader/loader";

interface UserInterface extends TweetAuthor {
  postedTweet: number;
  repliedTweet: number;
  image: string | null;
  _count: {
    tweets: number;
    likes: number;
    follower: number;
    following: number;
  };
}

interface ProfileHeaderProps {
  user: UserInterface;
  currentUser: TweetAuthor;
  isFollowing: boolean;
}

export default function ProfileHeader({
  user,
  currentUser,
  isFollowing,
}: ProfileHeaderProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFollowingStatus, setIsFollowingStatus] =
    useState<boolean>(isFollowing);
  const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false);
  const isOwnProfile = user.id === currentUser.id;

  async function handleFollow() {
    try {
      setIsLoading(true);

      const result = await followUser(user.id);

      if (result.success) {
        setIsFollowingStatus(result.action === "followed");
        router.refresh();
      }
    } catch (error) {
      toast.error("error following account", {
        position: "top-center",
        description: formatDate(new Date()),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='border-border border-b'>
      <div className='relative bg-linear-to-br from-pink-700 via-blue-700 to-purple-700 h-48'>
        {user.image ? (
          <CldImage
            src={user.image}
            alt='banner'
            width={800}
            height={192}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='relative bg-linear-to-br from-pink-700 via-blue-700 to-purple-700 h-48' />
        )}
      </div>

      <div className='px-4 pb-4'>
        <div className='flex justify-between items-start'>
          <div className='-mt-16 mb-4'>
            <Avatar className='shadow-xs hover:shadow-sm backdrop-blur-md rounded-full w-30 h-30 hover:scale-105 transition-all duration-200 hover:cursor-pointer'>
              <AvatarImage
                src={user.avatar ?? undefined}
                className='object-cover'
              />

              <AvatarFallback className='bg-white/10 backdrop-blur-xl border font-semibold text-primary text-4xl uppercase'>
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div>
            {isOwnProfile ? (
              <Button
                variant='outline'
                className='group z-10 flex items-center mt-4 font-medium text-primary'
                onClick={() => setIsEditingOpen(true)}
              >
                <Edit className='mr-2 w-4 h-4 group-hover:scale-105 transition-all group-hover:translate-x-0.5 duration-300 ease-out' />
                Edit Profile
              </Button>
            ) : (
              <Button
                disabled={isLoading}
                variant={isFollowingStatus ? "outline" : "secondary"}
                className='z-10 mt-4 font-medium text-primary'
                onClick={handleFollow}
              >
                {isLoading ? (
                  <span className='flex justify-center items-center gap-2'>
                    <Loader />
                  </span>
                ) : isFollowingStatus ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </Button>
            )}
          </div>
        </div>

        <div className='space-y-3'>
          <div>
            <h1 className='font-bold text-2xl'>{user.name}</h1>
            <h1 className='text-muted-foreground'>@{user.username}</h1>
          </div>
          {user.bio && <p className='text-foreground'>{user.bio}</p>}

          <div className='flex items-center text-muted-foreground text-sm space-4'>
            <div className='flex items-center space-x-1'>
              <Calendar className='w-4 h-4' />
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>

          <div className='flex items-center space-x-6 text-sm'>
            <div className='flex items-center space-x-1'>
              <span className='font-semibold text-foreground'>
                {user._count.following ?? 0}
              </span>
              <span className='text-muted-foreground'>Following</span>
            </div>
            <div className='flex items-center space-x-1'>
              <span className='font-semibold text-foreground'>
                {user._count.follower ?? 0}
              </span>
              <span className='text-muted-foreground'>Followers</span>
            </div>
            <div className='flex items-center space-x-1'>
              <span className='font-semibold text-foreground'>
                {user.postedTweet}
              </span>
              <span className='text-muted-foreground'>Tweets</span>
            </div>
          </div>
        </div>
      </div>

      <ProfileModel
        isOpen={isEditingOpen}
        onClose={() => setIsEditingOpen(false)}
        user={user}
      />
    </div>
  );
}
