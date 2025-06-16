import { getCurrentUser } from "../../lib/serverAuth";
import Sidebar from "../../components/Sidebar";
// import Upload from "../../components/UploadSection";
import { Chat } from "../../components/Chat";
import { notFound } from "next/navigation";
import { PdfVeiwer } from "@/app/components/PdfVeiwer";
import prisma from "@/app/lib/db";
import { OptionBar } from "@/app/components/OptionBar";
import RightPanel from "@/app/components/RightPanel";

type Props = {
  params: {
    paperId: string;
  };
};

const Paper = async ({ params }: Props) => {

  const paperId = params.paperId;
  const user = await getCurrentUser();

  if (!user) {
    return <p>Unauthorized</p>;
  }

  const paper = await prisma.paper.findUnique({
    where: { id: paperId },
  });

  if (!paper) return notFound();

  return (
    <div className="relative flex h-screen bg-gray-50 dark:bg-neutral-900">   
      <div className="fixed top-0 left-0 h-full z-40">
        <Sidebar />
      </div>
      
      <div className="flex-1 ml-35 mr-85 overflow-y-auto"> 
        <div className="min-h-full p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <PaperPage pdfUrl={paper.pdfUrl}/>
          </div>
        </div>
      </div>
      
      <div>
        <RightPanel paperId={paperId} userId={user.id}/>
      </div>
    </div>
  );
};



function PaperPage({pdfUrl}:{pdfUrl: string}){
  return (
    <div className="h-full w-full">
      <PdfVeiwer pdfUrl={pdfUrl} />
    </div>
  );
}

export default Paper;