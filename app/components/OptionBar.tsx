import { LayoutDashboard, MessageSquare, Notebook, AudioWaveform } from "lucide-react";


type Tab = "chat" | "overview" | "notes" | "audio";

// Menu items.
const items = [
  {
    label: "Overview", 
    value: "overview",
    icon: LayoutDashboard,
  },
  {
    label: "Chat", 
    value: "chat",
    icon: MessageSquare,
  },
  {
    label: "Notes", 
    value: "notes",
    icon: Notebook,
  },
  {
    label: "Audio", 
    value: "audio",
    icon: AudioWaveform,
  }
]

export function OptionBar({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) {
  return (
    <div className="flex bg-gray-100 border-b border-gray-200 dark:border-neutral-700 space-x-4 p-1">
      {items.map((item) => (
        <div key={item.value} className="border rounded-lg mt-1 mb-1 shadow-md relative group">
          <button
            key={item.value}
            onClick={() => setActiveTab(item.value as Tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === item.value
                ? "text-white rounded-lg bg-blue-400 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <item.icon/>
          </button>

          <span className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 text-xs text-white bg-gray-700 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 flex flex-col items-center">
            {item.label}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-gray-700"></div>
          </span>
        </div>
      ))}
    </div>
  );
}