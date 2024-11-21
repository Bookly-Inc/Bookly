"use client";

import Link from 'next/link';
import Image from 'next/image';
import { AppConfig } from '@/utils/AppConfig';
import { useUser, UserButton } from '@clerk/nextjs';
import { UnauthUserIcon } from '@/components/UnauthUserIcon';
import { Tooltip } from 'react-tooltip'

export const Header = () => {

  const { isSignedIn } = useUser()

  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: 'w-12 h-12'
    }
  }

  return (
    <div className="flex justify-between sticky top-0 z-50  p-4 text-center text-lg font-semibold text-gray-100 ">

      <Link href='/discovery' className='flex items-center'>
        <Image src={`/assets/images/bookly-logo.png`} alt='Bookly Logo' width={50} height={50}></Image>
        <h1 className="text-3xl font-bold text-gray-900">
          {AppConfig.name}
        </h1>
      </Link>

      <div className='flex justify-between items-center'>
        {isSignedIn ? (
          <>
              <a data-tooltip-id='dashboard' data-tooltip-content='Dashboard' data-tooltip-place='bottom' href='/dashboard'>
                <Image
                  src={`/assets/images/dashboard-icon.svg`}
                  alt='Dashboard Icon'
                  width={50}
                  height={50}
                  className='cursor-pointer mx-12'
                >
                </Image>
                <Tooltip id='dashboard' className='text-lg' style={ {padding: "4px"}}/>
              </a>
              
            <UserButton showName={false} appearance={userButtonAppearance} />
          </>
        ) : (
          <UnauthUserIcon isSignedIn={isSignedIn ?? false} />
        )}
      </div>
    </div>
  )
};
