"use client";

import Tweet from "./tweet";
import type { TweetType } from "@/types/tweet";

interface ReplyThreadProps {
  replies: TweetType[];
}

export default function ReplyThread({ replies }: ReplyThreadProps) {
  return (
    <>
      {replies.map((reply) => (
        <div
          key={reply.id}
          className='space-y-2 ml-6 pl-4 border-border border-l'
        >
          <Tweet tweet={reply} />

          {reply.children && reply.children.length > 0 && (
            <ReplyThread replies={reply.children} />
          )}
        </div>
      ))}
    </>
  );
}
