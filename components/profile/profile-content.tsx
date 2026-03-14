"use client";

import { useState } from "react";
import ProfileTabs from "./profile-tabs";
import {
  getUserLikes,
  getUserReplies,
} from "@/lib/actions/server/user/user-actions";
import { toast } from "sonner";
import { formatDate } from "@/utils/formate-date";
import Tweet from "../tweets/tweet";

interface ProfileContentProps {
  username: string;
  initialsTweets: Array<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    parentId: string | null;
    content: string;
    imageUrl: string | null;
    likes: {
      id: string;
      createdAt: Date;
      userId: string;
      tweetId: string;
    }[];
    author: {
      username: string | null;
      id: string;
      name: string;
      avatar: string | null;
    };
  }>;
  tweetCount: number;
  replyCount: number;
  likeCount: number;
  currentUserId: string;
}

export default function ProfileContent({
  username,
  initialsTweets,
  tweetCount,
  replyCount,
  likeCount,
  currentUserId,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(false);
  const [tweets, setTweets] = useState(initialsTweets);

  async function handleTabChange(tab: string) {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setIsLoading(true);
    try {
      let result;
      switch (tab) {
        case "posts":
          setTweets(initialsTweets);
          break;
        case "replies":
          result = await getUserReplies(username);
          setTweets(result.success ? result.tweetsReplies || [] : []);
          break;
        case "likes":
          result = await getUserLikes(username);
          setTweets(result.success ? result.tweet || [] : []);
          break;
        default:
          setTweets([]);
      }
    } catch (error) {
      toast.error("Failed to fetching tweets", {
        position: "top-center",
        description: formatDate(new Date()),
      });
      setTweets([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tweetCount={tweetCount}
        replyCount={replyCount}
        likeCount={likeCount}
      />

      {/* tweet feed  */}
      <div className='divide-y divide-border'>
        {isLoading ? (
          <div className='p-8 text-center'>
            <div className='inline-block border-blue-500 border-b-2 rounded-full w-8 h-8 animate-spin'></div>
          </div>
        ) : tweets.length > 0 ? (
          tweets.map((tweet, key) => (
            <Tweet currentUserId={currentUserId} tweet={tweet} key={key} />
          ))
        ) : (
          <div className='p-8 text-muted-foreground text-center'>
            <p>
              {activeTab === "posts" && "No tweets yet"}
              {activeTab === "replies" && "No replied tweet yet"}
              {activeTab === "likes" && "No liked tweet yet"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
