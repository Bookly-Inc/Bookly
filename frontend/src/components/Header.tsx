"use client";

import Link from 'next/link';
import Image from 'next/image';
import { AppConfig } from '@/utils/AppConfig';
import { useUser, UserButton } from '@clerk/nextjs';
import { UnauthUserIcon } from '@/components/UnauthUserIcon';

export const Header = () => {
  
  const { isSignedIn } = useUser()
  return (
    <div className="flex justify-between sticky top-0 z-50 bg-[#E9E9E9] p-4 text-center text-lg font-semibold text-gray-100 ">
      
        <Link href='/' className='flex items-center'>
          <Image src={`/assets/images/bookly-logo.png`} alt='Bookly Logo' width={50} height={50}></Image>
          <h1 className="text-3xl font-bold text-gray-900">
            {AppConfig.name}
          </h1>
        </Link>
    
      <div className='flex items-center'>
        { isSignedIn ? (
          <>
            <Link href='/dashboard' classname='text-green-500 hover:text-green-700 '>
              <UserButton showName={false}/>
            </Link>
          
          </>
        ) : (
          <UnauthUserIcon isSignedIn={isSignedIn}/>
        )}
      </div>
    </div>
  )
};
