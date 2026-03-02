"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email' className='font-medium text-sm'>
          Email
        </Label>
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='Enter Your Email Address'
          required
        />
        <Label htmlFor='password' className='font-medium text-sm'>
          Password
        </Label>
        <div className='relative'>
          <Input
            id='password'
            name='password'
            type={`${showPassword ? "text" : "password"}`}
            placeholder='Enter Your Password'
            required
          />
          <span className='top-[50%] right-0 absolute -translate-[50%]'>
            {showPassword ? (
              <EyeOff
                onClick={() => setShowPassword((pre) => !pre)}
                className='w-5 h-5'
              />
            ) : (
              <Eye
                onClick={() => setShowPassword((pre) => !pre)}
                className='w-5 h-5'
              />
            )}
          </span>
        </div>
      </div>
      <Button
        type='submit'
        className='bg-primary hover:bg-gray-800 w-full h-12 text-primary-foreground'
      >
        Signin
      </Button>
    </form>
  );
}
