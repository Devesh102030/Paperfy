"use server"

import { getServerSession } from "next-auth"
import { NEXT_AUTH_CONFIG } from "./auth";


export async function getCurrentUser(){
    const session  = await getServerSession(NEXT_AUTH_CONFIG);

    if(!session?.user?.email) return null;

    return session.user;
}