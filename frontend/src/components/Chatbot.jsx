import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Bot, X, Send } from "lucide-react";

export default function Chatbot({ questionCode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi, I’m DevBot — I give hints, not answers." },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Send message function
  async function send() {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((m) => [...m, { from: "user", text: userMsg }]);
    setInput("");
    try {
      const res = await axios.post("/api/chatbot", {
        message: userMsg,
        questionCode,
      });
      setMessages((m) => [...m, { from: "bot", text: res.data.hint }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { from: "bot", text: "Hint service unavailable." },
      ]);
    }
  }

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {/* Floating toggle button */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center 
                     bg-gradient-to-br from-[#0ea5e9] to-[#7c3aed] text-white hover:scale-105 transition"
        >
          <Bot size={20} />
        </button>
      ) : (
        <div
          className="w-80 h-96 flex flex-col rounded-2xl shadow-2xl border border-black/10 
                     bg-white dark:bg-[#0a0f1a] text-slate-800 dark:text-white transition"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full 
                              bg-gradient-to-br from-[#0ea5e9] to-[#7c3aed] text-white">
                <Bot size={16} />
              </div>
              <span className="font-semibold">DevBot</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-red-500 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                {m.from === "bot" && (
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#7c3aed] text-white mr-2">
                    <Bot size={12} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                    m.from === "bot"
                      ? "bg-black/5 dark:bg-white/10 text-slate-800 dark:text-white"
                      : "bg-gradient-to-br from-[#0ea5e9] to-[#7c3aed] text-white"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input box */}
          <div className="flex items-center gap-2 p-3 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for a hint..."
              className="flex-1 px-3 py-2 text-sm rounded-lg outline-none 
                         bg-white dark:bg-[#0f172a] text-slate-800 dark:text-white 
                         border border-black/10 dark:border-white/10"
            />
            <button
              onClick={send}
              className="p-2 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#7c3aed] text-white hover:opacity-90 transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
