"use client";

import { UploadDropzone } from "@uploadthing/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { OurFileRouter } from "../server/uploadthing";
import { useState } from "react";
import { Spinner } from "./Spinner";

export default function Upload() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center justify-center w-full">
      {loading && (
        <div className="fixed inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        <UploadDropzone<OurFileRouter, "paperUpload">
          endpoint="paperUpload"
          onClientUploadComplete={async (res) => {
            const file = res[0];
            try {
              setLoading(true);
              const response = await axios.post("/api/savepaper", {
                title: file.name,
                pdfUrl: file.ufsUrl,
              });

              console.log(response);

              const paperId = response.data.paper.id;
              if (!paperId) throw new Error("Paper ID missing");

              router.push(`/paper/${paperId}`);
            } catch (err) {
              alert("Upload failed");
              console.error(err);
            }
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
          className="ut-button:!bg-white ut-button:!text-blue-600 ut-button:hover:!bg-blue-50 ut-label:text-lg ut-allowed-content:text-sm"
          appearance={{
            container: "cursor-pointer border border-dashed border-neutral-300 dark:border-neutral-700 bg-white hover:bg-gray-100 dark:bg-black p-10 rounded-xl shadow-sm transition-all hover:shadow-md",
            uploadIcon: "text-blue-500 dark:text-blue-400",
            label: "text-gray-700 dark:text-gray-200 !text-2xl",
            allowedContent: "text-gray-500 dark:text-gray-400 text-sm mt-1",
            button: {
              backgroundColor: "#ffffff",
              color: "#2563eb", // Tailwind blue-600
              border: "1px solid #2563eb",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: 500,
              marginTop: "1rem",
            },
          }}
        />
      </motion.div>
    </div>
  );
}


