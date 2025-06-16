import { getCurrentUser } from "../lib/serverAuth";
import Sidebar from "../components/Sidebar";
import Upload from "../components/UploadSection";
import { OptionBar } from "../components/OptionBar";

export default async function Home(){
    const user = await getCurrentUser();
    
    if (!user) {
        return <p>Unauthorized</p>;
    }

    return(
        <div className="relative flex h-screen bg-gray-50 dark:bg-neutral-900">

            <div className="fixed top-0 left-0 h-full z-40">
                <Sidebar />
            </div>
            
            <div className="flex-1 ml-64 mr-80 overflow-y-auto">
                <div className="min-h-full p-4 md:p-8">
                    <div className="max-w-3xl mx-auto">
                        <Upload />
                    </div>
                </div>
            </div>
            
        </div>
    )
}