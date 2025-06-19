import { LayoutDashboard, MessageSquare, Notebook, Speaker } from "lucide-react";

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
    icon: Speaker,
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
    <div className="flex border-b border-gray-200 dark:border-neutral-700 p-1 space-x-2">
      {items.map((item, index) => (
        <button
          key={item.value}
          onClick={() => setActiveTab(item.value as Tab)}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === item.value
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <item.icon/>
        </button>
      ))}
    </div>
  );
}