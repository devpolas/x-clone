export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex justify-center items-center bg-background min-h-screen'>
      {children}
    </div>
  );
}
