'use client'
import React from 'react'
import { logoutAccount } from '../../lib/actions/user.actions'
import { useRouter } from 'next/navigation';
import Image from 'next/image'

const Footer = async ({user, type="desktop"}:FooterProps) => {
  const router=useRouter();
  
  const handleLogout=async ()=>{
const logout=await logoutAccount()
router.push('/sign-in')
  }

  return (
    <footer className="footer">
        <div className={type==='mobile' ? 'footer_name-mobile' : 'footer_name' }>
            <p className='text-xl font-bold text-gray-700 '>
                {user.firstName[0]}
            </p>
        </div>
        <div className="type==='mobile' ? 'footer_email-mobile' : 'footer_email'">
    <h1 className="text-14 truncate font-norma; text-gray-600 ">
      {user.firstName}
    </h1>
    <p className="text-14 text-gray-600 truncate font-normal">
      {user.email}
    </p>
        </div>
        <div className="footer_image" onClick={handleLogout}>
        <Image src="/icons/logout.svg" fill alt="jsm" />
      </div>
    </footer>
  )
}

export default Footer
