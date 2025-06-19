import { getCurrentUser } from "../lib/serverAuth";
import { SidebarDemo } from "../components/Sidebar";
import HomeDashboard from "../components/HomeDashboard";
import { redirect } from "next/navigation";

export default async function Home(){
    const user = await getCurrentUser();
    
    if (!user) {
        return redirect("/auth/signin");
    }

    return(
        <div className="flex h-screen w-screen">  
           <SidebarDemo>
            <div className="flex-1 h-full w-full overflow-auto">
                <HomeDashboard></HomeDashboard>
            </div>
           </SidebarDemo>
        </div>
    )
}

