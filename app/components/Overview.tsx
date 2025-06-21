"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "./Skeleton";

export default function Overview({ paperId}: { paperId: string }) {

  const [overview,setoverview] = useState("");
  const [loading,setLoading] = useState(true);

  useEffect(() => {
  let isMounted = true;
  let retries = 0;
  let maxRetries = 10; // Stop after 10 attempts (20 seconds)
  let timeoutId: NodeJS.Timeout;

  const fetchOverview = async () => {
    const tempOverview = localStorage.getItem(`Markedoverview-${paperId}`);
    if(tempOverview){
      setoverview(tempOverview);    
      setLoading(false);
    }
    else{
      try {
        const res = await axios.get("/api/getoverview", {
          params: { paperId },
        });

        if (res.data.overview && isMounted) {
          localStorage.setItem(`Markedoverview-${paperId}`, res.data.overview);
          setoverview(res.data.overview);
          setLoading(false);
        } else if (isMounted && retries < maxRetries) {
          retries++;
          timeoutId = setTimeout(fetchOverview, 2000);
        } else {
          // Stop retrying after maxRetries
          setLoading(false);
          console.warn("Overview not available after max retries.");
        }
      } catch (error) {
        console.error("Error fetching overview:", error);
        setLoading(false);
      }
    }
  };

  fetchOverview();

  return () => {
    isMounted = false;
    clearTimeout(timeoutId);
  };
}, [paperId]);



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
