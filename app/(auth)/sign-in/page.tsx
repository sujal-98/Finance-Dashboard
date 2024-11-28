import React from 'react'
import AuthForm from '../../components/AuthForm';
import { getLoggedInUser } from '../../../lib/actions/user.actions';

const SignIn = () => {

  const logged= async ()=>{
    const l=await getLoggedInUser();
    console.log(l)
  }
  logged()

  return (
    <section className='flex-center size-full max-sm:px-6'>
        <AuthForm type="sign-in" />
    </section>
)}

export default  SignIn;