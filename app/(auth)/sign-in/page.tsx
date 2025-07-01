import React from 'react'
import AuthForm from '../../components/AuthForm';
import { getLoggedInUser } from '../../../lib/actions/user.actions';
import { redirect } from 'next/navigation';

const SignIn = () => {

  const logged= async ()=>{
    const l=await getLoggedInUser();
    return l;
  }
    const loggedIn=   logged()
    if(!loggedIn) redirect('/sign-in')
  return (
    <section className='flex-center size-full max-sm:px-6'>
        <AuthForm type="sign-in" />
    </section>
)}

export default  SignIn;