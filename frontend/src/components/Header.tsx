import Link from 'next/link';

export const Header = () => (
  <div className="sticky top-0 z-50 bg-gray-900 p-4 text-center text-lg font-semibold text-gray-100 [&_a:hover]:text-green-700 [&_a]:text-green-500">
    Bookly Header -
    {' '}
    <Link href="/sign-up">Sign Up Link</Link>
  </div>
);
