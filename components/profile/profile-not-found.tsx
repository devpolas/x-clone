export default function ProfileNotFound() {
  return (
    <div className='p-8 text-center'>
      <h1 className='font-bold text-red-500 text-2xl'>User not found</h1>
      <p className='mt-2 text-muted-foreground'>
        The user you&apos;re looking for doesn&apos;t exits
      </p>
    </div>
  );
}
