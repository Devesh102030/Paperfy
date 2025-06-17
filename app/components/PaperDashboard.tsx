"use client"; // 👈 This is key

import RightPanel from "./RightPanel";
import { PdfVeiwer } from "./PdfVeiwer";

export default function PaperDashboard({ 
    pdfUrl,
    paperId,
    userId
 }: { 
    pdfUrl: string,
    paperId: string,
    userId: string 
}) {
  return (
    <div className="flex h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto">
            <div className="min-h-full p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <PaperPage pdfUrl={pdfUrl} />
            </div>
            </div>
        </div>

        <RightPanel paperId={paperId} userId={userId} />
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