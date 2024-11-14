import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default function CenteredLayout(props: { children: React.ReactNode }) {
  const { userId } = auth();

  // Redirect to home page if user has logged in
  if (userId) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      {props.children}
    </div>
  );
}
