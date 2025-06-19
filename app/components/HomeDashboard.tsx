"use client"; // 👈 This is key

import Upload from "./UploadSection";

export default function HomeDashboard() {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="font-bold text-base md:text-4xl dark:text-neutral-200">
          Paperfy
        </div>
        <div className="m-5 font-extralight text-base md:text-2xl dark:text-neutral-200">
          Upload a paper to get started
        </div>
      </div>
      <Upload />
    </div>
  );
}
