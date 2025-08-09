"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"
import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGoogle,
} from "@tabler/icons-react";
import { DotLoader } from "@/app/components/DotLoader";

export default function Signup() {

    const router = useRouter();

    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    //const [error,seterror] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        //seterror("");
        
        try{
          await axios.post("/api/auth/custom/signup",{
              name,
              email,
              password
          })
          
          await signIn("email", {
            email,
            callbackUrl: "/home",
            redirect: false
          });

          router.push("/check-email")

        }catch(err){
            console.log(err);
            //seterror(err.response?.data?.message || err.message || "Something went wrong")
        }
    }

  return (
     <div className="flex justify-center items-center h-screen">
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
            Welcome to Paperfy
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
            Sign up to upload research papers, get AI overviews, and manage your reading.
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
                <Label htmlFor="firstname">Name</Label>
                <Input onChange={(e)=> setname(e.target.value)} id="firstname" placeholder="Tyler Mathews" type="text" />
            </LabelInputContainer>
            
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input onChange={(e)=>setemail(e.target.value)} id="email" placeholder="projectmayhem@fc.com" type="email" />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input  onChange={(e)=>setpassword(e.target.value)} id="password" placeholder="••••••••" type="password" />
            </LabelInputContainer>

            {!loading ? (<button
              className="cursor-pointer group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
              type="submit"
            >
              Sign up &rarr;
              <BottomGradient />
            </button>
            ):(
              <button
                disabled
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-100 disabled:text-white disabled:cursor-not-allowed"
              >
                <div className="flex flex-col justify-center items-center"> <DotLoader/> </div>
              </button>
            )}

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-400 to-transparent dark:via-neutral-800" />

            <div className="flex flex-col space-y-4">
              <button
                onClick={()=>signIn("google",{ callbackUrl: "/home" })}
                className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                type="submit"
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Google
                </span>
                <BottomGradient />
              </button>
            </div>
          </form>
          <div>Already have an account? <a className="text-blue-400 underline" href="/auth/signin">Log in</a></div>
        </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
