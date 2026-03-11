"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { signupWithEmail } from "@/lib/actions/server/auth-actions";
import Loader from "../loader/loader";
import { useRouter } from "next/navigation";

type signinFormType = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<signinFormType>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const currentPassword = useWatch({ name: "password", control });

  const onSignup = async (data: signinFormType) => {
    try {
      setIsLoading(true);
      setIsError("");

      const result = await signupWithEmail(
        data.email,
        data.password,
        data.name,
        data.username,
      );

      if (result?.success) {
        router.push("/");
      }
    } catch (error) {
      if (error) {
        setIsError("An error occurred");
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
      <form className='space-y-4' onSubmit={handleSubmit(onSignup)}>
        <div className='space-y-2'>
          <Label htmlFor='name' className='font-medium text-sm'>
            Full Name
          </Label>
          <Input
            disabled={isLoading}
            id='name'
            type='text'
            placeholder='Enter Your Full Name'
            {...register("name", {
              required: true,
              minLength: 3,
              maxLength: 30,
            })}
          />

          {errors?.name?.type === "required" && (
            <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm'>
              Full Name is required
            </p>
          )}
          {errors?.name?.type === "minLength" && (
            <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm'>
              Full Name must be 3 characters
            </p>
          )}
          {errors?.name?.type === "maxLength" && (
            <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm'>
              Full Name max 30 characters long or less
            </p>
          )}

          <Label htmlFor='username' className='font-medium text-sm'>
            Username
          </Label>
          <Input
            disabled={isLoading}
            id='username'
            type='text'
            placeholder='Choose a Username'
            {...register("username", {
              required: true,
              minLength: 3,
              maxLength: 20,
            })}
          />

          {errors?.username?.type === "required" && (
            <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm'>
              Username is required
            </p>
          )}
          {errors?.username?.type === "minLength" && (
            <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm'>
              Username must be 3 characters
            </p>
          )}
          {errors?.username?.type === "maxLength" && (
            <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm'>
              Username max 20 characters long or less
            </p>
          )}

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
              placeholder='Create Your Password'
              {...register("password", {
                required: true,
                minLength: 8,
                maxLength: 30,
              })}
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
          {errors?.password?.type === "minLength" && (
            <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm'>
              Password must be 8 characters
            </p>
          )}
          {errors?.password?.type === "maxLength" && (
            <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm'>
              Password max 30 characters long or less
            </p>
          )}

          <Label htmlFor='confirmPassword' className='font-medium text-sm'>
            Confirm Password
          </Label>
          <div className='relative'>
            <Input
              disabled={isLoading}
              id='confirmPassword'
              type={`${showConfirmPassword ? "text" : "password"}`}
              placeholder='Confirm Your Password'
              {...register("confirmPassword", {
                required: true,
                validate: (value) => value === currentPassword,
              })}
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
          {errors?.confirmPassword?.type === "required" && (
            <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm'>
              Confirm password is required
            </p>
          )}
          {errors?.confirmPassword?.type === "validate" && (
            <p className='bg-red-50 p-2 rounded-md text-red-500 text-sm'>
              Password doesn&apos;t match!
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
              <Loader /> <span>Creating Account.....</span>
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </>
  );
}
