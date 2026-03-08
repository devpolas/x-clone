import MainLayout from "@/layouts/main-layout";

export default function page() {
  return (
    <MainLayout>
      <div className='border-border border-b'>
        <div className='p-4'>
          <h1 className='font-bold text-xl'>Home</h1>
        </div>
      </div>

      <div className='divide-y divide-border'>
        <div className='p-8 text-muted-foreground text-center'>
          <p>No tweets yet. Be the first tweet!</p>
        </div>
      </div>
    </MainLayout>
  );
}
