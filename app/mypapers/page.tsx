// app/mypapers/page.tsx

import { getCurrentUser } from "../lib/serverAuth";
import axios from "axios";
import { SidebarDemo } from "../components/Sidebar";
import { MyPaperDashboard } from "../components/MyPapersDashboard";

export default async function MyPapers({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    return <p>Unauthorized</p>;
  }

  const userId = user.id;
  const pageNum = parseInt(searchParams.page || "1");
  const limit = 10;

  const res = await axios.get("http://localhost:3000/api/getpapers", {
    params: {
      userId,
      pageNum,
      limit,
    },
  });

  const { papers, totalPages, currentPage } = res.data;

  return (
    <SidebarDemo>
      <MyPaperDashboard userId={userId} page={pageNum} />
    </SidebarDemo>
  );
}