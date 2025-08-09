"use client"
import { DotLoader } from "@/app/components/DotLoader";
import {
  IconBrandGoogle,
  IconAlertCircle,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";


export default function ResetPassword(){
    const router = useRouter();
    const [email,setemail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setError("");
      setLoading(true);

      const res = await fetch("/api/auth/forgotPassword", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok){
        setLoading(false);
        return setError(data.error || "Something went wrong");
      }

      setSent(true);
      setemail("");
      setLoading(false);

      setTimeout(() => setSent(false), 4000);
    }
            
    return(
        <div className="relative flex justify-center items-center h-screen">
            {sent && (
                <div className="absolute top-4 right-4 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg shadow-md animate-fade-in-down">
                  ✅ Check your email for a reset link!
                </div>
            )}
            <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                    Trouble logging in?
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                    Enter your email and we'll send you a link to get back into your account.
                </p>

                <form className="my-8" onSubmit={handleSubmit}>
            
                    {error && (
                        <div className="mb-4 flex items-center space-x-2 rounded-md bg-red-50 p-3 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                            <IconAlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}
            
                    <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input onChange={(e)=>setemail(e.target.value)} id="email" placeholder="projectmayhem@fc.com" type="email" 
                        className={error ? "border-red-300 focus:border-red-500" : ""}
                    />
                    </LabelInputContainer>
            
            
                    {!loading ? (
                    <button
                        className="cursor-pointer group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                        type="submit"
                        onKeyDown={(e)=>{
                          if(e.key === "Enter"){
                            handleSubmit(e);
                          }
                        }}
                    >
                        Send Link
                        <BottomGradient />
                    </button>
                    ) : (
                    <button
                        disabled
                        className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-100 disabled:text-white disabled:cursor-not-allowed"
                    >
                        <div className="flex flex-col justify-center items-center"> <DotLoader/> </div>
                    </button>
                    )}
            
                <div className="mt-8 mb-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-400 to-transparent dark:via-neutral-800" />
            
                
                </form>
            
                <div className="flex justify-center"><a className="text-lg text-neutral-700 hover:underline" href="/auth/signup">Create new account</a></div>
            
                </div>
            </div>
    )
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