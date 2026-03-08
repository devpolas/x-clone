import SigninForm from "@/components/auth-form/signin-form";
import ContinueWithGoogle from "@/components/social-auth-button/continue-with-google";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "signin",
};

export default function page() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='text-center'>
        <div className='flex justify-center items-center bg-primary rounded-full w-12 h-12'>
          <span className='font-bold text-primary-foreground text-xl'>X</span>
        </div>
        <CardTitle className='text-2xl'>Signin to Twitter</CardTitle>
        <CardDescription>Enter Your credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <ContinueWithGoogle />

        <div className='relative mb-6'>
          <div className='absolute inset-0 flex items-center'>
            <span className='border-t w-full' />
          </div>
          <div className='relative flex justify-around text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>OR</span>
          </div>
        </div>

        <SigninForm />

        <div className='mt-6 text-center'>
          <p className='text-muted-foreground text-sm'>
            Create an account?{" "}
            <Link className='text-primary hover:underline' href={"/signup"}>
              Signup
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
