// src/lib/server/appwrite.js
"use server";
import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    console.log(cookies());

    console.log(cookies().get('cookie'));

  const session = cookies().get("cookie");

  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_SECRET);

  return {
    get account() {
      return new Account(client);
    },
    get database(){
        return new Databases(client)
    },
    get user(){
        return new Users(client)
    },
  };
}
