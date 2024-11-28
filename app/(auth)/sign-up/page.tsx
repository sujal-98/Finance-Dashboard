import React from 'react'
import AuthForm from '../../components/AuthForm';
import { getLoggedInUser } from '../../../lib/actions/user.actions';

export default function SignUp(){
  const logged= async ()=>{
    const l=await getLoggedInUser();
    console.log(l)
  }
  logged()

  return (
    <section className='flex-center size-full max-sm:px-6'>
        <AuthForm type="sign-up" />
    </section>
  )
}

