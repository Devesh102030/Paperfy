import { getCurrentUser } from "../lib/serverAuth";
import axios from "axios";
import { SidebarDemo } from "../components/Sidebar";
import { MyPaperDashboard } from "../components/MyPapersDashboard";

interface Paper {
  id: string,
  content: string,
  overview: string,
  pdfUrl: string,
  createdAt: String,
  title: string
  status: string
}

interface MyPapersProps {
    searchParams: {page?: string}
}

export default async function MyPapers({ searchParams }: MyPapersProps){
    const user = await getCurrentUser();
    
    if (!user) {
        return <p>Unauthorized</p>;
    }

    const userId = user.id;
    const { page } = await searchParams;
    const pageNum = parseInt(page || "1");
    const limit = 10;

    const res = await axios.get("http://localhost:3000/api/getpapers",{
        params:{
            userId,
            pageNum,
            limit
        }
    })

    const { papers, totalPages, currentPage } = res.data;


    return(
      <SidebarDemo>
        <MyPaperDashboard userId={userId} page={pageNum}></MyPaperDashboard>
      </SidebarDemo>
    )
}


