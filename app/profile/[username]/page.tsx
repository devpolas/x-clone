import MainLayout from "@/layouts/main-layout";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const idResolver = await params;
  const [username] = idResolver.username;

  return (
    <MainLayout>
      <p>Profile ID: {[username]}</p>
    </MainLayout>
  );
}
