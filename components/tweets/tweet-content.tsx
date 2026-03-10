import React from "react";

interface TweetContentProps {
  content: string;
}

export function TweetContent({ content }: TweetContentProps) {
  if (!content) return null;

  const hashtagRegex = /#(\w+)/g;
  const mentionRegex = /@(\w+)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Split content by hashtags, mentions, and URLs
  const parts = content.split(
    new RegExp(`(${hashtagRegex.source}|${mentionRegex.source}|${urlRegex.source})`, "g")
  ).filter(Boolean); // remove empty strings

  return (
    <p className="text-foreground whitespace-pre-wrap">
      {parts.map((part, idx) => {
        if (typeof part !== "string") return null; // safety check

        if (part.match(hashtagRegex)) {
          return (
            <a
              key={idx}
              href={`/hashtag/${part.slice(1)}`}
              className="text-blue-500 hover:underline"
            >
              {part}
            </a>
          );
        }

        if (part.match(mentionRegex)) {
          return (
            <a
              key={idx}
              href={`/user/${part.slice(1)}`}
              className="text-blue-500 hover:underline"
            >
              {part}
            </a>
          );
        }

        if (part.match(urlRegex)) {
          return (
            <a
              key={idx}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {part}
            </a>
          );
        }

        return part; // plain text
      })}
    </p>
  );
}
