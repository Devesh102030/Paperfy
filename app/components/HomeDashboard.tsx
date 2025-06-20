"use client"; // 👈 This is key

import Upload from "./UploadSection";
import Image from "next/image";

export default function HomeDashboard() {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="flex justify-center items-center gap-2">
          <Image
            src= {"/icon-removebg-preview.png"}
            className="h-7 w-6 mt-[7px]"
            width={50}
            height={55}
            alt="icon"
          />
          <span className="font-bold text-base md:text-4xl dark:text-neutral-200"> Paperfy </span>
        </div>
        <div className="m-5 font-extralight text-base md:text-2xl dark:text-neutral-200">
          Upload a paper to get started
        </div>
      </div>
      <Upload />
    </div>
  );
}
