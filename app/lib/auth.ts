import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/app/lib/db";
import {compare} from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"; 
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Define proper types for credentials
interface Credentials {
    email: string;
    password: string;
}

// Define session callback parameters
interface SessionCallbackParams {
    session: Session;
    token: JWT;
}

export const NEXT_AUTH_CONFIG: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials:{
                email: {label:"Email", type: "text", placeholder:"name@example.com"},
                password: {label: "Password", type:"password", placeholder:"password"}
            },
            async authorize(credentials: Credentials | undefined){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing email or password")
                }

                const user = await prisma.user.findUnique({
                    where:{
                        email: credentials.email
                    }
                })

                if(!user || !user.password ) throw new Error("Invalid credentials or OAuth account. Try signing in with Google.");

                const isValid = await compare(credentials.password,user.password);
                if(!isValid) throw new Error("Incorrect password");

                // Remove password from returned user object
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...userCredentials } = user;

                return userCredentials;
            }
        }),  
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session:{
        strategy: "jwt"
    },
    pages:{
        signIn: "/auth/signin",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
        async session({ session, token }: SessionCallbackParams) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    }
}