"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name' className='font-medium text-sm'>
          Full Name
        </Label>
        <Input
          id='name'
          name='name'
          type='text'
          placeholder='Enter Your Full Name'
          required
        />
        <Label htmlFor='username' className='font-medium text-sm'>
          Username
        </Label>
        <Input
          id='username'
          name='username'
          type='text'
          placeholder='Choose a Username'
          required
        />
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
            placeholder='Create Your Password'
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
        <Label htmlFor='confirmPassword' className='font-medium text-sm'>
          Confirm Password
        </Label>
        <div className='relative'>
          <Input
            id='confirmPassword'
            name='confirmPassword'
            type={`${showConfirmPassword ? "text" : "password"}`}
            placeholder='Confirm Your Password'
            required
          />
          <span className='top-[50%] right-0 absolute -translate-[50%]'>
            {showConfirmPassword ? (
              <EyeOff
                onClick={() => setShowConfirmPassword((pre) => !pre)}
                className='w-5 h-5'
              />
            ) : (
              <Eye
                onClick={() => setShowConfirmPassword((pre) => !pre)}
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
        Create Account
      </Button>
    </form>
  );
}
