import { getCurrentUser } from "../../lib/serverAuth";
import { notFound } from "next/navigation";
import prisma from "@/app/lib/db";
import RightPanel from "@/app/components/RightPanel";
import PaperDashboard from "@/app/components/PaperDashboard";
import { SidebarDemo } from "@/app/components/Sidebar";


const Paper = async ({ params }: {params: Promise<{paperId: string}>}) => {

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
            <PaperDashboard pdfUrl={paper.pdfUrl} />
          </div>
        
          <RightPanel paperId={paperId} userId={user.id} />
        </div>
      </SidebarDemo>
    </div>
  );
};


export default Paper;