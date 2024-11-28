'use server'

import { ID, Query } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils"
import { parse } from "path"
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid"
import  {plaidClient}  from "../plaid"
import { revalidatePath } from "next/cache"
import { addFundingSource, createDwollaCustomer, createFundingSource } from "./dwolla.actions"
import { use } from "react"
import { error } from "console"


export const getUserInfo=async ({userId}: getUserInfoProps )=>{
  try{
    const {database}= await createAdminClient();
    const user=await database.listDocuments(
     process.env.APPWRITE_DATABASE_ID!,
     process.env.APPWRITE_DATABASE_USER_ID,
     [Query.equal('userid',[userId])]
    )
    console.log("docs" , user)
    return parseStringify(user.documents[0])
}catch(error){
console.log("Error ", error)
}
}


export const signIn=async ({email,password}:signInProps)=>{
    try{
      const { account } = await createAdminClient();
      const session = await account.createEmailPasswordSession(email, password);

        cookies().set("cookie", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: false,
          expires: new Date(Date.now() + 3600000), 
        });
        console.log("Cookie set:", cookies().get("cookie"));
const user=await getUserInfo({
  userId:session.userId
})
        return parseStringify(user);
    }
    catch(error){
        console.log('Error ',error)
    }
}

export const signUp=async ({password ,...userData}:SignUpParams)=>{
  try{
    let newUserAccount;  
        const { account,database } = await createAdminClient();
        const {email,firstName,lastName}=userData
        newUserAccount=await account.create(ID.unique(), email, password, `${firstName+lastName}`);
        
        if(!newUserAccount){
          throw new Error('Failed to create new user')
        }
        console.log(newUserAccount)


const dwollaCustomerUrl=await createDwollaCustomer({
  ...userData,
  type:'personal'
})

if(!dwollaCustomerUrl){
  throw new error('Failed to create dwolla customer')
}
const dwollaCustomerId=extractCustomerIdFromUrl(dwollaCustomerUrl)


const newUser= await database.createDocument(
  process.env.APPWRITE_DATABASE_ID!,
  process.env.APPWRITE_DATABASE_USER_ID!,
  ID.unique(),
  {
    ...userData,
    userid:newUserAccount.$id,
    dwolla_customer_id:dwollaCustomerId,
    dwolla_customer_url:dwollaCustomerUrl
  }
)

        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("cookie", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: false,
          expires: new Date(Date.now() + 3600000), 
        });
        console.log("Cookie set:", cookies().get("cookie"));

  return parseStringify(newUser)

    }
    catch(error){
        console.log('Error ',error)
    }
}

export async function getLoggedInUser() {
  try {
      const { account } = await createSessionClient();
      console.log("getloggedinuser Account ",account)
      const result = await account.get();

      const user=await getUserInfo({
        userId:result.$id
      })

      return parseStringify(user);
  } catch (error) {
      console.error("Error in getLoggedInUser:", error);
      return null;
  }
}


  export async function logoutAccount(){
    try{
      const {account}= await createAdminClient();
      cookies().delete('cookie')
      await account.deleteSession('current')
    }
    catch(error){
      return null
    }
  }

  export const createLinkToken=async (user:User)=>{
    try{
      const tokenParams={
user:{
  client_user_id:user.$id
},
client_name:`${user.firstName} ${user.lastName}`,
products:['auth','transactions'] as Products[],
language:'en',
country_codes:['US'] as CountryCode[],
}
const resp=await plaidClient.linkTokenCreate(tokenParams);
return parseStringify({
  linkToken:resp.data.link_token
})     
}   
    catch(error){
console.log("error",error)
    }
  }

  export const exchangePublicToken=async ({
    publicToken,user,
  }: exchangePublicTokenProps)=>{
try{
  console.log("user exchange", user)
  console.log("token ", publicToken)
const resp=await plaidClient.itemPublicTokenExchange({
  public_token:publicToken,
})
console.log(resp)
const accessToken=resp.data.access_token;
const itemId=resp.data.item_id;
//account info
const accinfo=await plaidClient.accountsGet({
  access_token:accessToken,

})
const data=accinfo.data.accounts[0];

const request: ProcessorTokenCreateRequest={
  access_token:accessToken,
  account_id:data.account_id,
  processor:"dwolla" as ProcessorTokenCreateRequestProcessorEnum,
}

const processorTokenResponse=await plaidClient.processorTokenCreate(request)
const processorToken=processorTokenResponse.data.processor_token;
const fundingSourceUrl = await addFundingSource({
  dwollaCustomerId: user.dwolla_customer_id,
  processorToken,
  bankName: data.name,
});

// If the funding source URL is not created, throw an error
if (!fundingSourceUrl) throw Error;

await createBankAccount({
  userId: user.$id,
  bankId: itemId,
  accountId: data.account_id,
  accessToken,
  fundingSourceUrl,
  sharableId: encryptId(data.account_id),
});
console.log("bank account created")

// Revalidate the path to reflect the changes
revalidatePath("/");

return parseStringify({
  publicTokenExchange: "complete",
});
} catch (error) {
console.error("An error occurred while creating exchanging token:", error);
}
}


export const createBankAccount=async({
  userId,
  bankId,
  accountId,accessToken,
  fundingSourceUrl,
  sharableId,
} : createBankAccountProps)=>{
  try{
    const {database}=await createAdminClient();
    const bankAccount=await database.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_DATABASE_BANKS_ID,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        sharableId,
      }
    )
    return parseStringify(bankAccount)
  }
  catch(error){
    console.log("Error: ",error)
  }
}


export const getBanks=async ({userId}:getBanksProps)=>{
try{
       const {database}= await createAdminClient();
       const banks=await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_DATABASE_BANKS_ID,
        [Query.equal('userId',[userId])]
       )
       console.log("get banks bank", banks)
       return parseStringify(banks)
}catch(error){
  console.log("Error ", error)
}
}

export const getBank=async ({documentId}:getBankProps)=>{
  try{
         const {database}= await createAdminClient();
         const banks=await database.listDocuments(
          process.env.APPWRITE_DATABASE_ID!,
          process.env.APPWRITE_DATABASE_BANKS_ID,
          [Query.equal('$id',[documentId])]
         )
         return parseStringify(banks.documents[0])
  }catch(error){
    console.log("Error ", error)
  }
  }

  export const getBankByAccountId= async ({accountId}:getBankByAccountIdProps)=>{
    try{
           const {database}= await createAdminClient();
           const banks=await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_DATABASE_BANKS_ID,
            [Query.equal('accountId',[accountId])]
           )
           if(banks.total!==1) return null;
           return parseStringify(banks.documents[0])
    }catch(error){
      console.log("Error ", error)
    }
    }