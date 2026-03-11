import MainLayout from "@/layouts/main-layout";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const idResolver = await params;
  const id = idResolver.id;

  return (
    <MainLayout>
      <p>Profile ID: {id}</p>
    </MainLayout>
  );
}
