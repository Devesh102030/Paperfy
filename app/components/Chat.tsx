"use client"
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export function Chat({ paperId }: { paperId: string }) {
  const [query, setquery] = useState("");
  const [messages, setmessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  const placeholders = [
    "Ask anything about this paper...",
    "What are the key findings?",
    "Summarize this section for me",
  ];

  useEffect(() => {
    const stored = localStorage.getItem(`chat-${paperId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setmessages(parsed);
        }
      } catch (e) {
        console.error("Failed to parse localStorage data", e);
      }
    }
    setInitialized(true);
  }, [paperId]);

  // Scroll to bottom on new message
   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (initialized) {
      localStorage.setItem(`chat-${paperId}`, JSON.stringify(messages));
    }
  }, [messages, paperId, initialized]);


  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage: { role: "user", text: string } = { role: "user", text: query };
    setmessages((prev) => [...prev, userMessage]);
    setquery("");
    setLoading(true);

    try {
      const res = await axios.get("/api/chat", {
        params: {
          message: query,
          paperId,
        },
      });

      const aiMessage: { role: "ai", text: string } = { role: "ai", text: res.data.answer };
      setmessages((prev) => [...prev, aiMessage]);

    }catch (err) {

      console.error("Error:", err);
      const aiMessage: { role: "ai", text: string } = { role: "ai", text: "Sorry, Something went wrong"};
      setmessages((prev) => [...prev, aiMessage]);

    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* Chat header */}
      <div className="p-4 border-b dark:border-neutral-700">
        <h3 className="font-semibold text-lg dark:text-white">Chat</h3>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-neutral-400">
            Chat messages will appear here
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-lg break-words ${
                msg.role === "user"
                  ? "bg-blue-500 text-white text-sm self-end ml-auto"
                  : "bg-gray-200 text-black text-sm self-start mr-auto"
              }`}
              style={{ maxWidth: "80%", width: "fit-content" }}
            >
              {msg.text}
            </div>
          ))
        )}

        {loading && (
          <div className="px-4 py-2 rounded-lg text-black text-sm self-start mr-auto animate-pulse">
            Thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>


      <div className="mb-4 flex flex-col justify-center  items-center px-4">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={(e) => setquery(e.target.value)}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
