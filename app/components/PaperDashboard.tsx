"use client"; // 👈 This is key

import { PdfVeiwer } from "./PdfVeiwer";

export default function PaperDashboard({ 
    pdfUrl,
 }: { 
    pdfUrl: string,
}) {
  return (
    <div className="flex h-screen overflow-hidden">
        <div className="flex-1">
            <div className="min-h-full">
            <div className="w-full">
                <PaperPage pdfUrl={pdfUrl} />
            </div>
            </div>
        </div>
    </div>
  );
}

function PaperPage({pdfUrl}:{pdfUrl: string}){
  return (
    <div className="h-screen">
      <PdfVeiwer pdfUrl={pdfUrl} />
    </div>
  );
}