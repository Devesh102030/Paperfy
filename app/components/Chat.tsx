"use client"
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export function Chat({ paperId, userId }: { paperId: string, userId: string }) {
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
    async function loadChat() {
      try {
        const res = await axios.get("/api/getchat", {
          params: { paperId, userId },
        });
        const chat = res.data.chat as { role: "user" | "ai"; content: string }[];
        const formatted = chat.map(msg => ({ role: msg.role, text: msg.content }));
        setmessages(formatted);
      } catch (e) {
        console.error("Failed to load chat", e);
      }
    }

    loadChat();
  }, [paperId, userId]);

  // Scroll to bottom on new message
   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, paperId, initialized]);


  const saveMessage = async (role: "user" | "ai", text: string) => {
    try {
      await axios.post("/api/savechat", {
        role,
        content: text,
        paperId,
        userId,
      });
    } catch (err) {
      console.error("Failed to save message", err);
    }
  };


  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage: { role: "user", text: string } = { role: "user", text: query };
    setmessages((prev) => [...prev, userMessage]);
    await saveMessage("user", query);
    setquery("");
    setLoading(true);

    try {
      const res = await axios.get("/api/chat", {
        params: {
          message: query,
          paperId,
        },
      });

      // const aiMessage: { role: "ai", text: string } = { role: "ai", text: res.data.answer };
      // setmessages((prev) => [...prev, aiMessage]);
      const fullText = res.data.answer;

      let currentText = "";

      setmessages((prev) => [...prev, { role: "ai", text: "" }]); // Start with empty AI message

      let index = 0;

      const typeInterval = setInterval(() => {
        if (index < fullText.length) {
          currentText += fullText[index];
          index++;

          setmessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];

            // Only update the last AI message
            if (lastMessage.role === "ai") {
              return [
                ...prevMessages.slice(0, -1),
                { ...lastMessage, text: currentText },
              ];
            } else {
              return prevMessages;
            }
          });
        } else {
          clearInterval(typeInterval);
          setLoading(false);
        }
      }, 20); // Speed (20ms per character)

      await saveMessage("ai", fullText);

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
                  ? "bg-blue-600 text-white text-sm self-end ml-auto shadow-md rounded-2xl px-4 py-2 max-w-[80%] transition-opacity duration-300 ease-in"
                  : "bg-white/80 text-black text-sm self-start mr-auto border border-gray-300 rounded-2xl px-4 py-2 shadow max-w-[80%] transition-opacity duration-300 ease-in"
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
