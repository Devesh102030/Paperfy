"use client";

import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "./ui/aurora-background";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
//interface user{ id: string; name?: string | null | undefined; email?: string | null | undefined; image?: string | null | undefined; }

export function HeroSection() {
    const router = useRouter();
    const {data: session} = useSession();

    function handleUpload(){
        if(!session?.user){
            router.push("/auth/signin");
        }else{
            router.push("/home");
        }
    }

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="flex justify-center items-center gap-4">
          <Image
            src= {"/icon-removebg-preview.png"}
            className="mt-[7px]"
            width={42}
            height={42}
            alt="icon"
          />
          <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
            Paperfy
          </div>
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Master Research Papers Effortlessly with AI.
        </div>
        <div className="font-extralight text-base md:text-xl dark:text-neutral-200">
          Smarter research. Faster results. Made for students and researchers.
        </div>
        <button onClick={handleUpload} className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2 mt-6">
          Upload now
        </button>
      </motion.div>
    </AuroraBackground>
  );
}
