import SignupForm from "@/components/auth-form/signup-form";
import ContinueWithGoogle from "@/components/social-auth-button/continue-with-google";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function page() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='text-center'>
        <div className='flex justify-center items-center bg-primary rounded-full w-12 h-12'>
          <span className='font-bold text-primary-foreground text-xl'>X</span>
        </div>
        <CardTitle className='text-2xl'>Create your account</CardTitle>
        <CardDescription>Join twitter today</CardDescription>
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

        <SignupForm />

        <div className='mt-6 text-center'>
          <p className='text-muted-foreground text-sm'>
            Already have an account?{" "}
            <Link className='text-primary hover:underline' href={"/signin"}>
              Signin
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
