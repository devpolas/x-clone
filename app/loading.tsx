import MainLayout from "@/layouts/main-layout";

export default function Loading() {
  return (
    <MainLayout>
      <main className='flex flex-1 justify-center items-center min-h-screen overflow-y-auto no-scrollbar'>
        <div className='justify-center items-center mx-auto max-w-2xl h-full'>
          <div className='inline-block border-blue-500 border-b-2 rounded-full w-8 h-8 animate-spin'></div>
        </div>
      </main>
    </MainLayout>
  );
}
