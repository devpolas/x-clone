"use client";

import { sessionUser } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ImageIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createTweet } from "@/lib/actions/server/tweet/tweets-actions";
import { useRouter } from "next/navigation";
import Loader from "../loader/loader";
import { toast } from "sonner";
import { formatDate } from "@/utils/formate-date";
import Image from "next/image";

interface TweetComposerProps {
  user?: sessionUser;
  placeholder?: string;
  onSubmit?: (content: string, imageUrl?: string) => void;
  onCancel?: () => void;
}

const IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function TweetComposer({
  user,
  placeholder = "What's Happening ?",
  onSubmit,
  onCancel,
}: TweetComposerProps) {
  const router = useRouter();

  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // validate image
    if (!file.type.startsWith("image/")) {
      toast.warning("Please select an image");
      return;
    }
    // validate image size
    if (file.size > IMAGE_SIZE) {
      toast.warning("Image size less than 5 MB");
      return;
    }

    setSelectedFile(file);

    // preview imageUrl
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);

    // optionally clear input to allow same file re-upload
    e.target.value = "";
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!content.trim() || isLoading) return;

    setIsLoading(true);

    try {
      let imageUrl: string | undefined;

      if (selectedFile) {
        setIsImageUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "x_clone");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          toast.error("Failed to upload image!", {
            position: "top-center",
            description: formatDate(new Date()),
          });
        }

        const data = await response.json();
        imageUrl = data.secure_url;

        // disable image loading
        setIsImageUploading(false);
      }

      if (onSubmit) {
        onSubmit(content.trim(), imageUrl);
        setContent("");
        setSelectedFile(null);
        setSelectedImage(null);
      } else {
        const result = await createTweet(content.trim(), imageUrl);
        if (result.success) {
          setContent("");
          setSelectedFile(null);
          setSelectedImage(null);
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
      }
    } catch (error) {
      toast.error("Failed to tweet!", {
        position: "top-center",
        description: formatDate(new Date()),
      });
    } finally {
      setIsLoading(false);
      setIsImageUploading(false);
    }
  }

  function removeImage() {
    setSelectedFile(null);
    setSelectedImage(null);
  }

  useEffect(() => {
    return () => {
      if (selectedImage) URL.revokeObjectURL(selectedImage);
    };
  }, [selectedImage]);

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

            {/* image preview */}
            {selectedImage && (
              <div className='relative rounded-lg w-48 h-24 overflow-hidden'>
                <Image
                  src={selectedImage}
                  alt='selected image'
                  width={192}
                  height={96}
                  className='w-full h-full object-cover'
                />
                <Button
                  type='button'
                  onClick={removeImage}
                  className='top-1 right-1 absolute flex justify-center items-center bg-black/50 hover:bg-black/70 p-0 rounded-full w-6 h-6 text-white hover:text-red-400'
                >
                  <X className='w-3 h-3' />
                </Button>
              </div>
            )}

            <div className='flex justify-between items-center'>
              <div className='flex space-x-4'>
                <Input
                  onChange={handleFileUpload}
                  type='file'
                  hidden
                  accept='image/*'
                  id='image-upload'
                />
                <Button
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
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

                {onCancel && (
                  <Button
                    variant={"destructive"}
                    className='px-6 cursor-pointer'
                    type='button'
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  type='submit'
                  className=''
                  disabled={
                    !content.trim() ||
                    content.length > 280 ||
                    isImageUploading ||
                    isLoading
                  }
                >
                  {isImageUploading || isLoading ? (
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
