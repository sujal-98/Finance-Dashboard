import React,{useEffect} from 'react';
import Sidebar from '../components/Sidebar';
import Image from "next/image";
import { MobileNav } from '../components/MobileNav';
import { getLoggedInUser } from '../../lib/actions/user.actions';
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 

  const loggedIn=  await getLoggedInUser()
  if(!loggedIn) redirect('/sign-in')

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />
      <div className="flex size-full flex-col w-full">
        <div className="flex justify-between items-center p-4 shadow-md bg-white lg:hidden md:hidden z-1">
          {/* App bar content */}
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div className='lg:hidden'>
          <MobileNav user={loggedIn} />
        </div></div>
        <div className="flex-grow p-4">
          {children}
        </div>
      </div>
    </main>
  );
}
