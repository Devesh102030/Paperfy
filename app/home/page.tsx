import { getCurrentUser } from "../lib/serverAuth";
import { SidebarDemo } from "../components/Sidebar";
import Upload from "../components/UploadSection";
import { OptionBar } from "../components/OptionBar";
import HomeDashboard from "../components/HomeDashboard";

export default async function Home(){
    const user = await getCurrentUser();
    
    if (!user) {
        return <p>Unauthorized</p>;
    }

    return(
        <div>  
           <SidebarDemo>
            <HomeDashboard></HomeDashboard>
           </SidebarDemo>
        </div>
    )
}

