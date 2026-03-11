"use client";
import { formatDate, formatTimeAgo } from "@/utils/formate-date";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { getInitials } from "@/utils/get-initials";
import { CldImage } from "next-cloudinary";
import { TweetContent } from "./tweet-content";
import Link from "next/link";
import TweetComposer from "./tweet-composer";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createTweetReply } from "@/lib/actions/tweet/tweets-actions";
import { toast } from "sonner";

interface TweetProps {
  tweet: {
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      username?: string | null;
      avatar?: string | null;
    };
  };
  currentUserId?: string;
}

export default function Tweet({ tweet, currentUserId }: TweetProps) {
  const [showReplyComposer, setShowReplyComposer] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const isTweetPage = pathname.startsWith("/tweet/");

  useEffect(() => {
    if (isTweetPage) {
      // eslint-disable-next-line
      setShowReplyComposer(true);
    }
  }, [isTweetPage]);

  function handleRouting() {
    if (pathname === "/") {
      router.push(`/tweet/${tweet.id}`);
    }
  }

  function handleTweetState() {
    if (!isTweetPage) {
      router.push(`/tweet/${tweet.id}`);
      return;
    }
    setShowReplyComposer((prev) => !prev);
  }

  async function handleTweetReply(content: string, imageUrl?: string) {
    try {
      const result = await createTweetReply(tweet.id, content, imageUrl);
      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to tweet reply!", {
        position: "top-center",
        description: formatDate(new Date()),
      });
    }
  }

  return (
    <>
      <div className='hover:bg-muted/50 p-4 border-border border-b'>
        <div className='flex space-x-3'>
          <Link href={`/profile/${tweet.author.id}`}>
            <Avatar className='w-10 h-10 cursor-pointer'>
              <AvatarImage src={tweet.author.avatar ?? undefined} />
              <AvatarFallback>{getInitials(tweet.author.name)} </AvatarFallback>
            </Avatar>
          </Link>

          <div className='flex-1 space-y-2'>
            <div className='flex items-center space-x-2'>
              <Link href={`/profile/${tweet.author.id}`}>
                <span className='font-semibold'>{tweet.author.name}</span>
              </Link>
              <span className='text-muted-foreground'>
                @{tweet.author.username}
              </span>
              <span className='text-muted-foreground'>.</span>
              <span className='text-muted-foreground'>
                {formatTimeAgo(tweet.createdAt)}
              </span>
            </div>

            <div onClick={handleRouting}>
              {/* tweet content  */}

              <TweetContent content={tweet.content} />

              {tweet.imageUrl && (
                <div className='mt-3'>
                  <CldImage
                    src={tweet.imageUrl}
                    alt='tweet image'
                    height={600}
                    width={800}
                    className='rounded-lg max-w-full max-h-96 object-cover'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200), 50vw, 33vw'
                  />
                </div>
              )}
            </div>

            <div className='flex flex-row items-center gap-x-6 text-muted-foreground'>
              <Button
                variant={"ghost"}
                className='flex items-center space-x-2 hover:text-primary cursor-pointer'
                onClick={handleTweetState}
              >
                <MessageCircle className='w-4 h-4' />
              </Button>

              <Button
                variant={"ghost"}
                className='flex items-center space-x-2 hover:text-green-500 cursor-pointer'
              >
                <Repeat2 className='w-4 h-4' /> <span>2</span>
              </Button>

              <Button
                variant={"ghost"}
                className='flex items-center space-x-2 hover:text-red-500 cursor-pointer'
              >
                <Heart className='w-4 h-4' /> <span>1</span>
              </Button>
              <Button
                variant={"ghost"}
                className='flex items-center space-x-2 hover:text-green-500 cursor-pointer'
              >
                <Repeat2 className='w-4 h-4' /> <span>2</span>
              </Button>
              <Button
                variant={"ghost"}
                className='flex items-center space-x-2 hover:text-primary cursor-pointer'
              >
                <Share className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showReplyComposer && (
        <div className='p-4 border-border border-b'>
          <TweetComposer
            placeholder='Tweet your reply.......'
            onSubmit={handleTweetReply}
            onCancel={() => setShowReplyComposer(false)}
          />
        </div>
      )}
    </>
  );
}
