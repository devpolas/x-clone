"use client";

import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Tweet from "./tweet";
import ReplyThread from "./reply-thread";
import { buildReplyTree } from "@/utils/build-reply-tree";
import { TweetType } from "@/types/tweet";

interface TweetDetailsProps {
  tweet: TweetType;
  replies: TweetType[];
}

export default function TweetDetails({ tweet, replies }: TweetDetailsProps) {
  const router = useRouter();

  const replyTree = buildReplyTree(replies, tweet.id);

  return (
    <div className='mx-auto max-w-2xl'>
      {/* Header */}
      <div className='flex items-center p-4 border-border border-b'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => router.back()}
          className='mr-4'
        >
          <ArrowLeft className='w-4 h-4' />
        </Button>

        <h1 className='font-bold text-xl'>Tweet</h1>
      </div>

      {/* Main Tweet */}
      <Tweet tweet={tweet} />

      {/* Replies */}
      <div className='divide-y divide-border'>
        {replyTree.length > 0 ? (
          <ReplyThread replies={replyTree} />
        ) : (
          <div className='p-8 text-muted-foreground text-center'>
            <MessageCircle className='opacity-50 mx-auto mb-4 w-12 h-12' />
            <p>No replies yet. Be the first to reply!</p>
          </div>
        )}
      </div>
    </div>
  );
}
