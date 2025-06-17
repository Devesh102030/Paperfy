"use client";
import React from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { IconAppWindow } from "@tabler/icons-react";


export function UseSectionCard({headingOne,headingTwo}:{headingOne: string, headingTwo: string}) {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <img
          src={``}
          alt="jordans"
          height="200"
          width="200"
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
