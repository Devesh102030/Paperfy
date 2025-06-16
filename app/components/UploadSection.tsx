"use client";

import type { OurFileRouter } from "../server/uploadthing";
import "@uploadthing/react/styles.css";
import { UploadDropzone } from "@uploadthing/react";
import axios from "axios";
// import { useState, type Dispatch, type SetStateAction } from "react";
// import { PdfVeiwer } from "../components/PdfVeiwer";
import { useRouter } from "next/navigation";


export default function Upload(){
  const router = useRouter();
  return(
    <div className="flex items-center justify-center w-full h-full">
      <UploadDropzone<OurFileRouter, "paperUpload">
        className="bg-slate-800 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
        endpoint="paperUpload"
        onClientUploadComplete={async (res) => {
          const file = res[0];
          try {
            const response = await axios.post("/api/savepaper", {
              title: file.name,
              pdfUrl: file.ufsUrl,
            });

            console.log(response);
            
            const paperId = response.data.paper.id;
            if (!paperId) throw new Error("Paper ID missing");

            router.push(`/paper/${paperId}`);
          } catch (error) {
            alert("Error uploading paper.");
            console.error(error);
          }
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}


// type Props = {
//   setuploded: Dispatch<SetStateAction<boolean>>;
// };

// type NotUploadedProps = {
//   setUploaded: Dispatch<SetStateAction<boolean>>;
//   setPdfUrl: Dispatch<SetStateAction<string | null>>;
// };

// type UploadedProps = {
//   pdfUrl: string;
// };

// export default function Upload() {
//   const [uploaded, setUploaded] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   return (
//     <div className="h-full w-full">
//       {!uploaded && (
//             <PaperNotUploaded
//             setUploaded={setUploaded}
//             setPdfUrl={setPdfUrl}
//             />
//         )}
//         {uploaded && pdfUrl && <PaperUploaded pdfUrl={pdfUrl} />}
//     </div>
//   );
// }

// function PaperNotUploaded({ setUploaded, setPdfUrl }: NotUploadedProps) {
//   return (
//     <div className="flex items-center justify-center w-full h-full">
//       <UploadDropzone<OurFileRouter, "paperUpload">
//         className="bg-slate-800 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
//         endpoint="paperUpload"
//         onClientUploadComplete={async (res) => {
//           const file = res[0];
//           const action = await axios.post("/api/savepaper", {
//             title: file.name,
//             pdfUrl: file.ufsUrl,
//           });

//           if (!action) {
//             alert("Error uploading");
//           } else {
//             setPdfUrl(file.ufsUrl);
//             setUploaded(true);
//           }
//         }}
//         onUploadError={(error: Error) => {
//           alert(`ERROR! ${error.message}`);
//         }}
//       />
//     </div>
//   );
// }

// function PaperUploaded({ pdfUrl }: UploadedProps) {
//   return (
//     <div>
//       <PdfVeiwer pdfUrl={pdfUrl} />
//     </div>
//   );
// }


