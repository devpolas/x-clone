"use client";
import { Chrome } from "lucide-react";
import { Button } from "../ui/button";
import { signinWithGoogle } from "@/lib/actions/server/auth-actions";
import { useState } from "react";
import Loader from "../loader/loader";

export default function ContinueWithGoogle() {
  const [isLoading, setIsLoading] = useState(false);
  async function handleGoogleSignin() {
    setIsLoading(true);
    await signinWithGoogle();

    setIsLoading(false);
  }
  return (
    <div className='space-y-3 mb-6'>
      <Button
        disabled={isLoading}
        onClick={handleGoogleSignin}
        className='bg-white hover:bg-gray-50 border border-gray-300 w-full h-12 text-black'
      >
        {isLoading ? (
          <span className='flex justify-center items-center gap-2'>
            <Loader /> <span>signup with google</span>
          </span>
        ) : (
          <span className='flex justify-center items-center gap-2'>
            <Chrome className='mr-1 w-5 h-5' /> <span>signup with google</span>
          </span>
        )}
      </Button>
    </div>
  );
}
