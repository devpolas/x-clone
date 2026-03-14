import { FileText, Heart, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tweetCount: number;
  replyCount: number;
  likeCount: number;
}

export default function ProfileTabs({
  activeTab,
  onTabChange,
  tweetCount,
  replyCount,
  likeCount,
}: ProfileTabsProps) {
  const tabs = [
    { id: "posts", label: "Posts", icon: FileText, count: tweetCount },
    { id: "replies", label: "Replies", icon: MessageSquare, count: replyCount },
    { id: "likes", label: "Likes", icon: Heart, count: likeCount },
  ];

  return (
    <div className='border-border border-b'>
      <div className='flex'>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActiveTab = activeTab === tab.id;
          return (
            <Button
              variant={"ghost"}
              key={tab.id}
              className={cn(
                "flex-1 py-5 border-b-2 rounded-none",
                isActiveTab
                  ? "border-b-4 border-blue-400 text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
              onClick={() => onTabChange(tab.id)}
            >
              <span className='flex flex-row items-center space-x-2'>
                <Icon className='w-4 h-4' />
                <span className='font-medium'>{tab.label}</span>
                <span className='text-muted-foreground text-sm'>
                  {tab.count}
                </span>
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
