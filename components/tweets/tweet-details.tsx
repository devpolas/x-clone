"use client";

import { ArrowLeft, MessageCircle } from "lucide-react";
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
  replies: Array<{
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
  }>;
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
      <Tweet tweet={tweet} />

      {/* tweet replies  */}
      <div className='divide-y divide-border'>
        {replies.map((reply) => (
          <Tweet tweet={reply} key={reply.id} />
        ))}

        {replies.length === 0 && (
          <div className='p-8 text-muted-foreground text-center'>
            <MessageCircle className='opacity-50 mx-auto mb-4 w-12 h-12' />
            <p>No replies yet. Be the first to reply!</p>
          </div>
        )}
      </div>
    </div>
  );
}
