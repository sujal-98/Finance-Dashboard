"use client"
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../@/components/ui/button';
import {
  Form
} from '../../@/components/ui/form';
import CustomInput from './customInput'
import { formSchema } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '../../lib/actions/user.actions';
import PlaidLink from './PlaidLink';

const AuthForm = ({ type }: { type: string }) => {
  const router=useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const schema=formSchema(type)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password:''
    },
  });
  useEffect(() => {
    console.log("Validation Errors:", form.formState.errors);
  }, [form.formState.errors])

  async function onSubmit(data: z.infer<typeof schema>) {
    setLoading(true); 
    try {
      if(type==='sign-up'){
        const userData = {
            firstName: data.firstName!,
            lastName: data.lastName!,
            address1: data.address!,
            state: data.state!,
            postalCode: data.postalCode!,
            dateOfBirth: data.dob!,
            ssn: data.ssn!,
            email: data.email,
            password: data.password,
            city:data.city
          }
          const newUser = await signUp(userData);
        console.log("new user: ",newUser)
        setUser(newUser)
      }
      else if(type==='sign-in'){
        const resp=await signIn({
          email:data.email,
          password:data.password,
        })
        console.log("resp ",resp)
        if(resp) router.push('/')
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    } finally {
      setLoading(false); 
    }
  }

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1 px-4">
          <Image src="/icons/logo.svg" width={34} height={34} alt="Horizon Logo" />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
            <p className="text-16 font-normal text-gray-600">
              {user ? 'Link your account to get started' : 'Please enter your details'}
            </p>
          </h1>
        </div>
      </header>

      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {type==='sign-up' && (
              <>
              <div className="flex gap-4">
              <CustomInput control={form.control} name='firstName' label='First Name' placeholder='Enter your First Name:' type='text' />
              <CustomInput control={form.control} name='lastName' label='Last Name' placeholder='Enter your Last Name:' type='text' />
              </div>
              <div className="flex gap-4">
              <CustomInput control={form.control} name='address' label='Address' placeholder='Enter your specific address:' type='text' />
              <CustomInput control={form.control} name='state' label='State' placeholder='ex: Delhi' type='text' />
              <CustomInput control={form.control} name='postalCode' label='Postal Code' placeholder='ex:110092' type='text' />
              </div>
              <CustomInput control={form.control} name='city' label='city' placeholder='ex:new delhi' type='text' />
              <div className="flex gap-4">
              <CustomInput control={form.control} name='dob' label='Date Of Birth' placeholder='yyyy-mm-dd' type='date' />
              <CustomInput control={form.control} name='ssn' label='SSN' placeholder='ex: 1234' type='text' />
              </div>
              </>
            )}
             <CustomInput control={form.control} name='username' label='UserName' placeholder='Enter you username' type='text' />
             <CustomInput control={form.control} name='email' label='Email' placeholder='Enter you email' type='email' />
             <CustomInput control={form.control} name='password' label='Password' placeholder='Enter you Password' type='password' />
             <Button 
  type="submit" 
  disabled={loading} 
  className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
    loading ? "opacity-75 cursor-not-allowed" : ""
  }`}
>
  {loading ? (
    <>
      <Loader2 size={20} className="animate-spin" /> &nbsp;
      Loading...
    </>
  ) : type === "sign-in" ? "Sign In" : "Sign Up"}
</Button>

            </form>
          </Form>
        </>
       )} 
      <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === 'sign-in'
              ? "Don't have an account?"
              : "Already have an account?"}
            </p>
            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
              {type === 'sign-in' ? 'Sign up' : 'Sign in'}
            </Link>
          </footer>
    </section>
  );
};

export default AuthForm;
