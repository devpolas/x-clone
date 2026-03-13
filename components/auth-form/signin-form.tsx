"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { signinWithEmail } from "@/lib/actions/server/auth/auth-actions";
import Loader from "../loader/loader";
import { useRouter } from "next/navigation";

type SigninData = {
  email: string;
  password: string;
};

export default function SigninForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (data: SigninData) => {
    try {
      setIsLoading(true);
      setIsError("");

      const result = await signinWithEmail(data.email, data.password);
      if (result?.success) {
        router.push("/");
      }
    } catch (error) {
      if (error) {
        setIsError("Invalid Credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isError && (
        <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm text-center'>
          {isError}
        </p>
      )}
      <form onSubmit={handleSubmit(handleSignin)} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email' className='font-medium text-sm'>
            Email
          </Label>
          <Input
            disabled={isLoading}
            id='email'
            type='email'
            placeholder='Enter Your Email Address'
            {...register("email", { required: true })}
          />

          {errors?.email?.type === "required" && (
            <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm'>
              Email is required
            </p>
          )}

          <Label htmlFor='password' className='font-medium text-sm'>
            Password
          </Label>
          <div className='relative'>
            <Input
              disabled={isLoading}
              id='password'
              type={`${showPassword ? "text" : "password"}`}
              placeholder='Enter Your Password'
              {...register("password", { required: true })}
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

          {errors?.password?.type === "required" && (
            <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm'>
              Password is required
            </p>
          )}
        </div>
        <Button
          variant={"secondary"}
          disabled={isLoading}
          type='submit'
          className='w-full h-12 text-primary'
        >
          {isLoading ? (
            <span className='flex justify-center items-center gap-2'>
              <Loader /> <span>Signin.....</span>
            </span>
          ) : (
            "Signin"
          )}
        </Button>
      </form>
    </>
  );
}
