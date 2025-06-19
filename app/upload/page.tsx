"use client";
import type { OurFileRouter } from "../server/uploadthing";
import "@uploadthing/react/styles.css";
import { UploadDropzone } from "@uploadthing/react";
import axios from "axios";
import { useState } from "react";
import { PdfVeiwer } from "../components/PdfVeiwer";

export default function Upload() {
  const [uploaded, setUploaded] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  return (
    <div className="w-full h-full">
      {!uploaded ? (
        <div className="h-full flex items-center justify-center">
          <UploadDropzone<OurFileRouter, "paperUpload">
            className="w-full bg-slate-800 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
            endpoint="paperUpload"
            onClientUploadComplete={async (res) => {
              const file = res?.[0];
              if (!file) return;
              
              try {
                await axios.post("/api/savepaper", {
                  title: file.name,
                  pdfUrl: file.ufsUrl,
                });
                setPdfUrl(file.ufsUrl);
                setUploaded(true);
              } catch (error) {
                console.log(error);
                alert("Error uploading file");
              }
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
      ) : (
        pdfUrl && (
          <div className="h-full w-full">
            <PdfVeiwer pdfUrl={pdfUrl} />
          </div>
        )
      )}
    </div>
  );
}