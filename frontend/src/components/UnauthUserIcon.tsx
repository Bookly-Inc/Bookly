"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface UnauthUserIconProps {
  isSignedIn: boolean;
}

export const UnauthUserIcon: React.FC<UnauthUserIconProps> = ({isSignedIn}) => {
  
  const [showPopover, setShowPopover] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)   // used to reference popover div

  const handleProfileClick = () => {
    if (!isSignedIn) {
      setShowPopover(!showPopover)
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Close popover if mouse click is outside of popover
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false)
      }
    }

    // Add click event listeners whenever popover is opened
    showPopover ? document.addEventListener('click', handleOutsideClick) : document.removeEventListener('click', handleOutsideClick)

    // Remove event listener when popover closes to prevent memory leaks
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [showPopover])

  return ( 
    <>
      <Image 
        className='rounded-full cursor-pointer' 
        onClick={handleProfileClick}
        src={'/assets/images/unauthenticated-user.svg'}
        alt='Unauthenticated User'
        width={50}
        height={50}  
      >
      </Image>
        {
          showPopover && (
            <div ref={popoverRef} className='absolute text-base top-[72px] right-0 bg-white p-2 shadow-lg rounded-md'>
              <p className='text-gray-700 m-2'>Please log in to access your profile.</p>
              <Link href='/sign-in' className='bg-green-500 rounded-md p-[5px]'><button>Sign In</button></Link>
            </div>
          )
        }
      </>

  );
}
 
