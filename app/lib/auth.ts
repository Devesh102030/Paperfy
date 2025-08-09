import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/app/lib/db";
import {compare} from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"; 
import EmailProvider  from "next-auth/providers/email";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { RaycastMagicLinkEmail } from "@/app/components/email-template";// adjust path if needed
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
        }),
        EmailProvider({
            server: {},
            from: "Paperfy <paperfy@deveshparyani.tech>",
            maxAge: 60 * 60 * 24, 
            async sendVerificationRequest({ identifier, url, provider }) {
                console.log("recieved");
                try {
                    await resend.emails.send({
                        from: provider.from as string,
                        to: ["deveshparyani17@gmail.com"],
                        subject: "Your Paperfy Verification Link",
                        react: RaycastMagicLinkEmail({ magicLink: url }),
                    });
                } catch (error) {
                    console.error("Error sending verification email:", error);
                    throw new Error("Unable to send verification email");
                }
            },
        }),
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