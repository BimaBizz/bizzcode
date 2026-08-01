"use client";

import { useState, useEffect, useRef } from "react";

const parseMarkdown = (text) => {
  if (!text) return "";
  
  // 1. Escape HTML first to prevent XSS
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Parse Markdown Tables into beautiful mobile-friendly lists
  const lines = html.split("\n");
  const parsedLines = [];
  let inTable = false;
  let headers = [];
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if line is a table row
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      const isSeparator = cells.every(c => /^:?-+:?$/.test(c));
      
      if (isSeparator) {
        inTable = true;
        continue;
      }
      
      if (!inTable) {
        headers = cells;
        inTable = true;
      } else {
        tableRows.push(cells);
      }
    } else {
      if (inTable && headers.length > 0) {
        let cardHtml = '<div class="space-y-3 my-3">';
        tableRows.forEach(row => {
          cardHtml += '<div class="p-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">';
          for (let j = 0; j < Math.max(headers.length, row.length); j++) {
            const header = headers[j] || "Info";
            const cell = row[j] || "-";
            cardHtml += `<div><span class="text-zinc-400 dark:text-zinc-500 font-semibold block text-[9px] uppercase tracking-wider">${header}</span><span class="text-zinc-800 dark:text-zinc-200 text-xs">${cell}</span></div>`;
          }
          cardHtml += "</div>";
        });
        cardHtml += "</div>";
        parsedLines.push(cardHtml);
        
        inTable = false;
        headers = [];
        tableRows = [];
      }
      
      parsedLines.push(line);
    }
  }

  if (inTable && headers.length > 0) {
    let cardHtml = '<div class="space-y-3 my-3">';
    tableRows.forEach(row => {
      cardHtml += '<div class="p-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">';
      for (let j = 0; j < Math.max(headers.length, row.length); j++) {
        const header = headers[j] || "Info";
        const cell = row[j] || "-";
        cardHtml += `<div><span class="text-zinc-400 dark:text-zinc-500 font-semibold block text-[9px] uppercase tracking-wider">${header}</span><span class="text-zinc-800 dark:text-zinc-200 text-xs">${cell}</span></div>`;
      }
      cardHtml += "</div>";
    });
    cardHtml += "</div>";
    parsedLines.push(cardHtml);
  }

  let parsedText = parsedLines.join("\n");

  // 3. Parse links [Label](URL)
  parsedText = parsedText.replace(/\[([^\]]+)\]\(\s*([^\s)]+)\s*\)/g, (match, label, url) => {
    const cleanUrl = url.replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
    const isExternal = cleanUrl.startsWith("http") || cleanUrl.startsWith("//");
    const target = isExternal ? 'target="_blank" rel="noopener noreferrer"' : 'target="_self"';
    return `<a href="${cleanUrl}" ${target} class="text-[#4ADE80] hover:underline font-semibold">${label}</a>`;
  });

  // 4. Parse auto-links <url>
  parsedText = parsedText.replace(/&lt;(https?:\/\/[^&>]+)&gt;/g, (match, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#4ADE80] hover:underline font-semibold">${url}</a>`;
  });

  // 5. Parse bold text **bold**
  parsedText = parsedText.replace(/\*\*([^*]+)\*\*/g, "<strong class=\"text-[#EAF6EF]\">$1</strong>");

  // 6. Parse inline code `code`
  parsedText = parsedText.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-[#0B3B36] text-[#B0F5EC] border border-[#1E3A2C]/60 rounded font-mono text-[10px]">$1</code>');

  // 7. Parse bullet points (lines starting with - or * followed by space)
  parsedText = parsedText.replace(/^(?:\s*)[-*•]\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  return <div dangerouslySetInnerHTML={{ __html: parsedText }} className="space-y-1" />;
};

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Halo! Saya adalah Asisten AI BMDev. Saya dapat membantu menjawab pertanyaan Anda seputar proyek dan layanan yang ada di website ini.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const chatUidRef = useRef(null);

  useEffect(() => {
    // Generate a unique session ID for streaming progress tracking
    chatUidRef.current = "chat-" + Math.random().toString(36).substring(2, 11);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const updatedMessages = [...messages, userMessage];

    // Placeholder for streaming assistant response
    const assistantPlaceholder = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          uid: chatUidRef.current,
          useTools: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal terhubung dengan asisten.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        text += chunkValue;

        // Update the last message (the assistant response) with the streamed text
        setMessages((prev) => {
          const list = [...prev];
          if (list.length > 0) {
            list[list.length - 1] = {
              role: "assistant",
              content: text,
            };
          }
          return list;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const list = [...prev];
        if (list.length > 0) {
          list[list.length - 1] = {
            role: "assistant",
            content: "Maaf, terjadi kesalahan saat memproses permintaan Anda. Pastikan koneksi aman.",
          };
        }
        return list;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Bubble Button (Material 3 Expressive) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-[24px] bg-[#4ADE80] !text-[#062011] shadow-2xl hover:scale-105 active:scale-95 transition-all duration-350 ease-[cubic-bezier(.34,1.56,.64,1)] group focus:outline-none"
        aria-label="Tanya Asisten AI"
      >
        <span className="absolute w-full h-full rounded-[24px] bg-[#4ADE80]/20 animate-ping opacity-75 group-hover:hidden" />
        {isOpen ? (
          <svg className="w-6 h-6 stroke-[#062011]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 stroke-[#062011]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window Dialog (Material 3 Expressive Surface) */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[380px] h-[500px] bg-[#0F221A]/95 border border-[#1E3A2C] rounded-[28px] rounded-br-[8px] shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 border-b border-[#1E3A2C] flex items-center justify-between bg-[#081410]/80">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] animate-pulse shadow-sm shadow-[#4ADE80]/50" />
              <div>
                <h4 className="font-heading font-semibold text-sm text-[#EAF6EF] leading-tight">
                  BMDev Assistant
                </h4>
                <p className="text-[10px] text-[#8FAB9C] font-medium">
                  Powered By AI
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#1E3A2C]/60 text-[#8FAB9C] hover:text-[#EAF6EF] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[20px] px-4 py-3 text-xs shadow-md break-words ${
                    msg.role === "user"
                      ? "bg-[#4ADE80] !text-[#062011] rounded-tr-none font-bold"
                      : "bg-[#081410] text-[#EAF6EF] border border-[#1E3A2C] rounded-tl-none leading-relaxed"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : msg.content ? (
                    parseMarkdown(msg.content)
                  ) : (
                    <span className="flex items-center gap-1.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-bounce delay-300" />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-[#1E3A2C] bg-[#081410]/80 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanyakan tentang proyek kami..."
              disabled={isLoading}
              className="flex-1 bg-[#0F221A] border border-[#1E3A2C] rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80] disabled:opacity-60 text-[#EAF6EF] placeholder-[#8FAB9C]/60"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#4ADE80] !text-[#062011] font-bold disabled:opacity-40 transition-all shadow-md shadow-[#4ADE80]/10"
            >
              <svg className="w-4 h-4 rotate-90 stroke-[#062011]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
