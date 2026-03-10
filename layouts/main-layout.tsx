import Sidebar from "@/components/sidebar/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex bg-background h-screen'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto no-scrollbar'>
        <div className='mx-auto'>{children}</div>
      </main>

      <div className='bg-background p-6 border-border border-l w-80'>
        <div className='space-y-4'>
          <h3 className='font-semibold text-lg'> What&apos;s happening</h3>
          <div className='space-y-3'>
            <div className='p-4 border border-border rounded-lg'>
              <p className='text-muted-foreground text-sm'>
                Technology Trending
              </p>
              <p className='font-semibold'>#NextJS</p>
              <p className='text-muted-foreground text-sm'>12.5K posts</p>
            </div>
            <div className='p-4 border border-border rounded-lg'>
              <p className='text-muted-foreground text-sm'>
                Technology Trending
              </p>
              <p className='font-semibold'>#React</p>
              <p className='text-muted-foreground text-sm'>8.2K posts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
