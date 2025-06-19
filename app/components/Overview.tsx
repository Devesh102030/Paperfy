"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "./Skeleton";

export default function Overview({ paperId}: { paperId: string }) {

  const [overview,setoverview] = useState("");
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
        async function fetchOverview(){
            const res = await axios.get("/api/getoverview",{
                params:{
                    paperId
                }
            })
            console.log(res.data.overview);
            //const formattedOverview = res.data.overview.replace(/\\n/g, '\n');
            
            setoverview(res.data.overview);
            
            setLoading(false);
        }
        fetchOverview();
  },[paperId])

  return (
    <div className="flex flex-col h-full">
        <div className="p-4 border-b dark:border-neutral-700">
            <h3 className="font-semibold text-lg dark:text-white">Overview</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!loading ? (
            <div className="prose prose-zinc prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {overview}
              </ReactMarkdown>
            </div>
          ): (
            <> 
              <div className="py-2">
                <Skeleton/>
              </div>
              <div className="py-2">
                <Skeleton/>
              </div>
              <div className="py-2">
                <Skeleton/>
              </div>
              <div className="py-2">
                <Skeleton/>
              </div>
              <div className="py-2">
                <Skeleton/>
              </div>
            </>
          )}
        </div>
    </div>
  );
}
