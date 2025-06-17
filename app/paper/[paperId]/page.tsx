import { getCurrentUser } from "../../lib/serverAuth";
// import Sidebar from "../../components/Sidebar";
// import Upload from "../../components/UploadSection";
import { Chat } from "../../components/Chat";
import { notFound } from "next/navigation";
import { PdfVeiwer } from "@/app/components/PdfVeiwer";
import prisma from "@/app/lib/db";
import { OptionBar } from "@/app/components/OptionBar";
import RightPanel from "@/app/components/RightPanel";
import PaperDashboard from "@/app/components/PaperDashboard";
import { SidebarDemo } from "@/app/components/Sidebar";

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
    <div>   
      <SidebarDemo>
        <PaperDashboard pdfUrl={paper.pdfUrl} paperId={paperId} userId={user.id} />
      </SidebarDemo>
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