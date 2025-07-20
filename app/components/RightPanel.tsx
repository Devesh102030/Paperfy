"use client";
import { useState } from "react";
import {OptionBar} from "./OptionBar"; // same as before
import {Chat} from "./Chat";
import Overview from "./Overview";
import Notes from "./Notes";
import OverviewAudio from "./Audio";

type Tab = "chat" | "overview" | "notes" | "audio";

export default function RightPanel({ paperId, userId }: { paperId: string, userId: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="right-0 h-screen flex flex-1 flex-col bg-white dark:bg-neutral-800 border-l border-gray-200 dark:border-neutral-700 z-30">
      <OptionBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto">
        {activeTab === "chat" && <Chat paperId={paperId} userId={userId} />}
        {activeTab === "overview" && <Overview paperId={paperId} />}
        {activeTab === "notes" && <Notes paperId={paperId} userId={userId}/>}
        {activeTab === "audio" && <OverviewAudio paperId={paperId} />}
      </div>
    </div>
  );
}