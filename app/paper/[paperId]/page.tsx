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

  const { paperId } = await params;
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
        <div className="flex flex-1 h-screen overflow-hidden">
          <div className="max-w-5xl">
            <PaperDashboard pdfUrl={paper.pdfUrl} paperId={paperId} userId={user.id} />
          </div>
        
          <RightPanel paperId={paperId} userId={user.id} />
        </div>
      </SidebarDemo>
    </div>
  );
};


export default Paper;