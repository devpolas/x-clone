"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Tweet from "./tweet";

interface TweetDetailsProps {
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
  replies: null;
  currentUserId: string;
}

export default function TweetDetails({
  tweet,
  replies,
  currentUserId,
}: TweetDetailsProps) {
  const router = useRouter();

  return (
    <div className='mx-auto max-w-2xl'>
      <div className='flex items-center p-4 border-border border-b'>
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={() => router.back()}
          className='mr-4 cursor-pointer'
        >
          <ArrowLeft className='w-4 h-4' />
          <h1 className='font-bold text-xl'>Tweet</h1>
        </Button>
      </div>

      {/* main tweet  */}
      <Tweet tweet={tweet} currentUserId={tweet.author.id} />
    </div>
  );
}
