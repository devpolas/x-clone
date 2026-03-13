"use client";
import { TweetAuthor } from "@/types/tweet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useRef, useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  updateUserProfile,
  uploadImageToCloudinary,
} from "@/lib/actions/server/user/user-actions";
import { toast } from "sonner";
import { formatDate } from "@/utils/formate-date";
import { useRouter } from "next/navigation";

const IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
interface TweeterAuthorModal extends TweetAuthor {
  image: string | null;
}

interface ProfileModelProps {
  user: TweeterAuthorModal;
  onClose: () => void;
  isOpen: boolean;
}

export default function ProfileModel({
  user,
  onClose,
  isOpen,
}: ProfileModelProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isBanner, setIsBanner] = useState<string | null>(user.image || null);
  const [isAvatar, setIsAvatar] = useState<string | null>(user.avatar || null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormDate] = useState({
    name: user.name,
    username: user.username ?? "",
    bio: user.bio || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormDate((pre) => ({ ...pre, [name]: value }));
  };

  async function handleUploadImage(file: File, type: "avatar" | "banner") {
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      if (type === "avatar") {
        setIsAvatar(imageUrl);
      } else {
        setIsBanner(imageUrl);
      }
    } catch (error) {
      toast.error("Failed to upload image!", {
        position: "top-center",
        description: formatDate(new Date()),
      });
    }
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner",
  ) {
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
    handleUploadImage(file, type);
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateUserProfile({
        ...formData,
        avatar: isAvatar || undefined,
        banner: isBanner || undefined,
      });
      if (!result.success && !result.auth) {
        router.push(`/signin?callbackURL=/profile${user.username}`);
      }
      if (result.success) {
        toast.success("update profile successfully", {
          position: "top-center",
          description: formatDate(new Date()),
        });
        router.push(`/profile/${result.user?.username}`);
        onClose();
      } else {
        toast.error(result.error || "Failed to update profile!", {
          position: "top-center",
          description: formatDate(new Date()),
        });
      }
    } catch (error) {
      toast.error("Failed to upload image!", {
        position: "top-center",
        description: formatDate(new Date()),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form className='space-y-6' onSubmit={handleSubmit}>
          <div className='relative'>
            <div className='relative bg-linear-to-br from-pink-700 via-blue-700 to-purple-700 rounded-lg h-32 overflow-hidden'>
              {isBanner && (
                <Image
                  src={isBanner}
                  alt='profile banner'
                  fill
                  className='object-cover'
                />
              )}
            </div>
            <Input
              onChange={(e) => handleFileChange(e, "banner")}
              type='file'
              hidden
              accept='image/*'
              ref={bannerInputRef}
            />
            <Button
              onClick={() => bannerInputRef.current?.click()}
              variant={"outline"}
              size={"icon-sm"}
              type='button'
              className='group top-2 right-2 absolute'
            >
              <Camera className='w-5 h-5 group-hover:scale-110 transition-all duration-150' />
            </Button>
          </div>

          <div className='flex items-center space-x-4 -mt-16 ml-4'>
            <div className='group relative w-20 h-20'>
              <Avatar className='shadow-sm rounded-full w-20 h-20 transition-all duration-150 group-hover:cursor-pointer'>
                <AvatarImage
                  src={isAvatar ?? undefined}
                  className='object-cover'
                />

                <AvatarFallback className='bg-white/10 backdrop-blur-md border font-semibold text-primary text-2xl uppercase transition-all duration-150'>
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              <Input
                onChange={(e) => handleFileChange(e, "avatar")}
                type='file'
                hidden
                accept='image/*'
                ref={profileInputRef}
              />
              <Button
                onClick={() => profileInputRef.current?.click()}
                variant={"outline"}
                size={"icon-lg"}
                type='button'
                className='hidden top-1/2 left-1/2 absolute group-hover:flex group-hover:backdrop-blur-xs rounded-full w-full h-full text-white -translate-x-1/2 -translate-y-1/2 transform'
              >
                <Camera className='bg-transparent group-hover:bg-transparent w-8 h-8 transition-all duration-300' />
              </Button>
            </div>
          </div>

          <div className='space-y-4 pt-4'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='name' className='font-medium text-sm'>
                Name
              </Label>
              <Input
                id='name'
                name='name'
                placeholder='Enter your name'
                required
                maxLength={50}
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='username' className='font-medium text-sm'>
                Username
              </Label>
              <Input
                id='username'
                name='username'
                placeholder='Choose your username'
                required
                maxLength={30}
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='bio' className='font-medium text-sm'>
                Bio
              </Label>
              <Textarea
                id='bio'
                name='bio'
                placeholder='Tell us yourself'
                required
                rows={3}
                maxLength={160}
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <Button type='button' variant={"destructive"} onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit'>Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
