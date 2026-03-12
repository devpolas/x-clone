"use client";

import Tweet from "./tweet";
import type { TweetType } from "@/types/tweet";

interface ReplyThreadProps {
  replies: TweetType[];
  currentUserId?: string;
}

export default function ReplyThread({
  replies,
  currentUserId,
}: ReplyThreadProps) {
  return (
    <>
      {replies.map((reply) => (
        <div
          key={reply.id}
          className='space-y-2 ml-6 pl-4 border-border border-l'
        >
          <Tweet tweet={reply} currentUserId={currentUserId} />

          {reply.children && reply.children.length > 0 && (
            <ReplyThread
              replies={reply.children}
              currentUserId={currentUserId}
            />
          )}
        </div>
      ))}
    </>
  );
}
