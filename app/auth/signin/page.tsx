"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGoogle,
  IconAlertCircle,
} from "@tabler/icons-react";
import { DotLoader } from "@/app/components/DotLoader";

export default function SigninPage() {
    const router = useRouter();
    const [email,setemail] = useState("");
    const [password,setpassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // <== Prevent default form reload
        setLoading(true);
        setError(null);

      try{
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        console.log(res);
        if (res?.ok){ 
          router.push("/home");
        }else{
          if (res?.error === "Invalid credentials or OAuth account. Try signing in with Google.") {
              setError("Invalid email or password. Please try again.");
          } else if (res?.error === "Configuration") {
              setError("There was a configuration error. Please contact support.");
          } else {
              setError("Something went wrong. Please try again.");
          }
        }
      }catch(err){
        console.error("Sign-in error:", err);
        setError("Network error. Please check your connection and try again.");
      }finally {
        setLoading(false);
      }
    }

    const handleGoogleSignIn = async () => {
      try {
          setError(null);
          await signIn("google", { callbackUrl: "/home" });
      } catch (err) {
          console.error("Google sign-in error:", err);
          setError("Failed to sign in with Google. Please try again.");
      }
    };

  return (
    <div className="mt-18 shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Paperfy
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Upload and explore your research papers with AI — log in to access your dashboard.
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
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input onChange={(e)=>setpassword(e.target.value)} id="password" placeholder="••••••••" type="password"
            className={error ? "border-red-300 focus:border-red-500" : ""} 
          />
        </LabelInputContainer>

        {!loading ? (
          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Log In &rarr;
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

      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-400 to-transparent dark:via-neutral-800" />

      <div className="flex flex-col space-y-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
        >
          <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Google</span>
          <BottomGradient />
        </button>
      </div>
    </form>

    <div> Do not have an account? <a className="text-blue-400 underline" href="/auth/signup">Sign up</a></div>

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


