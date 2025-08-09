"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DotLoader } from "@/app/components/DotLoader";
import {
  IconBrandGoogle,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Suspense } from 'react'


function MyComponent() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No token provided");
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if(password != confirmPassword){
        setError("Passwords do not match");
        return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/resetPassword", {
      method: "POST",
      body: JSON.stringify({ token, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok){
        setLoading(false);
        return setError(data.error || "Something went wrong");
    }

    setLoading(false);

    router.push("/auth/signin");
  }

  if (!token) {
    return <p className="text-red-500">Invalid reset link</p>;
  }

  return (
    <div className="relative flex justify-center items-center h-screen">
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                Change Password
            </h2>

            <form className="my-8" onSubmit={handleSubmit}>
        
                {error && (
                    <div className="mb-4 flex items-center space-x-2 rounded-md bg-red-50 p-3 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                        <IconAlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}
        
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Enter New Password</Label>
                    <Input onChange={(e)=>setPassword(e.target.value)} id="password" placeholder="••••••••" type="password"
                        className={error ? "border-red-300 focus:border-red-500" : ""} 
                    />
                </LabelInputContainer>
                
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Confirm Password</Label>
                    <Input onChange={(e)=>setConfirmPassword(e.target.value)} id="password" placeholder="••••••••" type="password"
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
                    Change Password
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
            
            </form>
        
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


export default function ResetPassword(){
    return(
        <Suspense>
            <MyComponent/>
        </Suspense>
    )
}