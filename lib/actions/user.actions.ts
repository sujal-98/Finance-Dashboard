'use server'

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"

export const signIn=async ()=>{
    try{
        //operations
    }
    catch(error){
        console.log('Error ',error)
    }
}

export const signUp=async (userData:SignUpParams)=>{
    try{
        const { account } = await createAdminClient();
        const {email,password,firstName,lastName}=userData
        const newUserAcoount=await account.create(ID.unique(), email, password, `${firstName+lastName}`);
        const session = await account.createEmailPasswordSession(email, password);

  cookies().set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
    }
    catch(error){
        console.log('Error ',error)
    }
}

export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      return await account.get();
    } catch (error) {
      return null;
    }
  }

  