"use client";
import React from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import Image from "next/image";

export function UseSectionCard({headingOne,headingTwo,image}:{headingOne: string, headingTwo: string, image: string}) {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px]  max-w-md p-4 sm:p-5 bg-white dark:bg-zinc-900">
        <Image
          src={`${image}`}
          alt="image"
          height="400"
          width="400"
          className="object-contain"
        />
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          {headingOne}
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {headingTwo}
        </p>
        
      </BackgroundGradient>
    </div>
  );
}


// C:/Users/user/Desktop/js/final-project/images/drop.jpeg