import ProfileContent from "@/components/profile/profile-content";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileNotFound from "@/components/profile/profile-not-found";
import MainLayout from "@/layouts/main-layout";
import { getSession } from "@/lib/actions/server/auth/auth-actions";
import { getUserProfile } from "@/lib/actions/server/user/user-actions";
import { redirect } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const idResolver = await params;
  const username = idResolver.username;
  const session = await getSession();
  if (!session) {
    redirect(`/signin?callbackURL=/profile/${username}`);
  }

  const [profileInfo] = await Promise.all([getUserProfile(username)]);

  const user = profileInfo.user;

  if (!user) return null;

  return (
    <MainLayout>
      <div className='top-0 z-10 sticky bg-background p-4 border-border border-b'>
        <h1 className='font-bold text-xl'>Profile</h1>
      </div>
      {!profileInfo.success ? (
        <ProfileNotFound />
      ) : (
        <>
          <ProfileHeader user={user} currentUser={session.user} />
          <ProfileContent />
        </>
      )}
    </MainLayout>
  );
}
