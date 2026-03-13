"use client";

import { Button } from "../ui/button";
import { signinWithGoogle } from "@/lib/actions/server/auth/auth-actions";
import { useState } from "react";
import Loader from "../loader/loader";
import G_ICON from "@/assets/google.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ContinueWithGoogle() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  async function handleGoogleSignin() {
    setIsLoading(true);
    const result = await signinWithGoogle();

    if (result?.success) {
      router.push("/");
    }

    setIsLoading(false);
  }
  return (
    <div className='space-y-3 mb-6'>
      <Button
        disabled={isLoading}
        onClick={handleGoogleSignin}
        className='w-full h-12 text-primary'
        variant={"secondary"}
      >
        {isLoading ? (
          <span className='flex justify-center items-center gap-2'>
            <Loader /> <span>Continue with google</span>
          </span>
        ) : (
          <span className='flex justify-center items-center gap-2'>
            <Image
              src={G_ICON}
              alt='google icon'
              height={20}
              width={20}
              className='w-5 h-5 object-cover'
            />
            <span>Continue with google</span>
          </span>
        )}
      </Button>
    </div>
  );
}
