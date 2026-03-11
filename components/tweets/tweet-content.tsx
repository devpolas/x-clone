import React from "react";

interface TweetContentProps {
  content: string;
}

const HASHTAG_REGEX = /^#\w+$/;
const MENTION_REGEX = /^@\w+$/;
const URL_REGEX = /^https?:\/\/[^\s]+$/;

const SPLIT_REGEX = /(https?:\/\/[^\s]+|#\w+|@\w+)/g;

export function TweetContent({ content }: TweetContentProps) {
  if (!content) return null;

  const parts = content.split(SPLIT_REGEX).filter(Boolean);

  console.log(parts);

  return (
    <p className='text-foreground warp-break-words whitespace-pre-wrap'>
      {parts.map((part, i) => {
        if (URL_REGEX.test(part)) {
          return (
            <a
              key={i}
              href={part}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 hover:underline'
            >
              {part}
            </a>
          );
        }

        if (HASHTAG_REGEX.test(part)) {
          return (
            <a
              key={i}
              href={`/hashtag/${part.slice(1)}`}
              className='text-blue-500 hover:underline'
            >
              {part}
            </a>
          );
        }

        if (MENTION_REGEX.test(part)) {
          return (
            <a
              key={i}
              href={`/profile/${part.slice(1)}`}
              className='text-blue-500 hover:underline'
            >
              {part}
            </a>
          );
        }

        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </p>
  );
}
