import Sidebar from "@/components/sidebar/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex bg-background h-screen'>
      <Sidebar />
      {children}
    </main>
  );
}
