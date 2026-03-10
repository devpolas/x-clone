"use client";

import { sessionUser } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { createTweet } from "@/lib/actions/tweet/tweets-actions";
import { useRouter } from "next/navigation";
import Loader from "../loader/loader";
import { toast } from "sonner";
import { formatDate } from "@/utils/formate-date";

interface TweetComposerProps {
  user?: sessionUser;
  placeholder?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function TweetComposer({
  user,
  placeholder = "What's Happening ?",
  onSubmit,
  onCancel,
}: TweetComposerProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!content.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const result = await createTweet(content.trim());
      if (result.success) {
        setContent("");
        router.refresh();

        toast.success("Tweet has been created", {
          position: "top-center",
          description: formatDate(new Date()),
        });
      } else {
        toast.error("Failed to tweet!", {
          position: "top-center",
          description: formatDate(new Date()),
        });
      }
    } catch (error) {
      toast.error("Failed to tweet!", {
        position: "top-center",
        description: formatDate(new Date()),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='p-4 border-border border-b'>
      <form className='space-y-3' onSubmit={handleSubmit}>
        <div className='flex space-x-3'>
          {user && (
            <Avatar className='w-10 h-10'>
              <AvatarImage src={user.avatar ?? undefined} />
              <AvatarFallback> {getInitials(user.name ?? "")} </AvatarFallback>
            </Avatar>
          )}

          <div className='flex-1 space-y-3'>
            <Textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder={placeholder}
              className='border-0 focus-visible:ring-0 min-h-25 placeholder:text-muted-foreground text-lg resize-none'
            />

            <div className='flex justify-between items-center'>
              <div className='flex space-x-4'>
                <Input type='file' hidden accept='image/*' id='image-upload' />
                <Button
                  variant={"ghost"}
                  type='button'
                  className='text-blue-500 hover:text-blue-600'
                >
                  <ImageIcon className='w-5 h-5' />
                </Button>
              </div>

              <div className='flex items-center space-x-3'>
                <span className='text-muted-foreground text-sm'>
                  {content.length}/280
                </span>

                <Button
                  type='submit'
                  className=''
                  disabled={
                    !content.trim() || content.length > 280 || isLoading
                  }
                >
                  {isLoading ? (
                    <span className='flex justify-center items-center gap-2'>
                      <Loader /> <span>Tweeting.....</span>
                    </span>
                  ) : (
                    "Tweet"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
