"use client"
import { useState, useRef, useEffect } from "react";
import axios from "axios";

export function Chat({ paperId }: { paperId: string }) {
  const [query, setquery] = useState("");
  const [messages, setmessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="p-4 border-t dark:border-neutral-700">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setquery(e.target.value)}
            type="text"
            placeholder="Ask a question..."
            className="flex-1 border rounded-lg px-4 py-2 dark:bg-neutral-700 dark:border-neutral-600"
          />
          <button
            onClick={async () => {
              const userMessage: { role: "user", text: string } = { role: "user", text: query };
              setmessages((prev) => [...prev, userMessage]);
              setquery("");

              const res = await axios.get("/api/chat", {
                params: {
                  message: query,
                  paperId,
                },
              });

              const aiMessage: { role: "ai", text: string } = { role: "ai", text: res.data.answer };
              setmessages((prev) => [...prev, aiMessage]);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
