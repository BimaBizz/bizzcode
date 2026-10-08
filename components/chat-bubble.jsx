"use client";

import { useState, useEffect, useRef } from "react";

const parseMarkdown = (text) => {
  if (!text) return "";

  // 1. Escape HTML first to prevent XSS
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Parse Markdown Tables into compact mobile-friendly cards
  const lines = html.split("\n");
  const parsedLines = [];
  let inTable = false;
  let headers = [];
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.split("|").map((c) => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      const isSeparator = cells.every((c) => /^:?-+:?$/.test(c));

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
        let cardHtml = '<div class="space-y-2 my-2">';
        tableRows.forEach((row) => {
          cardHtml += '<div class="p-2.5 bg-[#0D0D10] border border-[#27272A] rounded-lg space-y-1">';
          for (let j = 0; j < Math.max(headers.length, row.length); j++) {
            const header = headers[j] || "Info";
            const cell = row[j] || "-";
            cardHtml += `<div><span class="text-[#71717A] font-mono block text-[9px] uppercase tracking-wider">${header}</span><span class="text-[#FAFAFA] text-xs">${cell}</span></div>`;
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
    let cardHtml = '<div class="space-y-2 my-2">';
    tableRows.forEach((row) => {
      cardHtml += '<div class="p-2.5 bg-[#0D0D10] border border-[#27272A] rounded-lg space-y-1">';
      for (let j = 0; j < Math.max(headers.length, row.length); j++) {
        const header = headers[j] || "Info";
        const cell = row[j] || "-";
        cardHtml += `<div><span class="text-[#71717A] font-mono block text-[9px] uppercase tracking-wider">${header}</span><span class="text-[#FAFAFA] text-xs">${cell}</span></div>`;
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
    return `<a href="${cleanUrl}" ${target} class="text-[#E8452C] hover:underline font-medium">${label}</a>`;
  });

  // 4. Parse auto-links <url>
  parsedText = parsedText.replace(/&lt;(https?:\/\/[^&>]+)&gt;/g, (match, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#E8452C] hover:underline font-medium">${url}</a>`;
  });

  // 5. Parse bold text **bold**
  parsedText = parsedText.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

  // 6. Parse inline code `code`
  parsedText = parsedText.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-[#0A0A0A] text-[#FAFAFA] border border-[#27272A] rounded font-mono text-[10px]">$1</code>');

  // 7. Parse bullet points
  parsedText = parsedText.replace(/^(?:\s*)[-*•]\s+(.+)$/gm, '<li class="ml-4 list-disc text-[#D4D4D8]">$1</li>');

  return <div dangerouslySetInnerHTML={{ __html: parsedText }} className="space-y-1" />;
};

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Halo! Saya adalah Asisten AI BMDev. Saya dapat membantu menjawab pertanyaan Anda seputar proyek, stack teknis, dan layanan.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const chatUidRef = useRef(null);

  useEffect(() => {
    chatUidRef.current = "chat-" + Math.random().toString(36).substring(2, 11);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const updatedMessages = [...messages, userMessage];
    const assistantPlaceholder = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
            content: "Maaf, terjadi kendala saat memproses permintaan. Silakan coba kembali.",
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
      {/* Floating Chat Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#121212] border border-[#27272A] text-[#FAFAFA] hover:border-[#E8452C] hover:text-[#E8452C] shadow-2xl transition-all duration-200 active:scale-95 group focus:outline-none"
        aria-label="Tanya Asisten AI"
      >
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#E8452C] ring-2 ring-[#0A0A0A]" />
        {isOpen ? (
          <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 z-50 w-[350px] sm:w-[380px] h-[480px] bg-[#121212]/95 border border-[#27272A] rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="p-3.5 border-b border-[#27272A] flex items-center justify-between bg-[#181818]/80">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#E8452C]" />
              <div>
                <h4 className="font-medium text-xs text-[#FAFAFA] leading-tight">
                  BMDev Assistant
                </h4>
                <p className="text-[10px] text-[#71717A] font-mono">
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#27272A] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs shadow-sm break-words ${
                    msg.role === "user"
                      ? "bg-[#E8452C] text-white rounded-tr-none font-medium"
                      : "bg-[#181818] text-[#FAFAFA] border border-[#27272A] rounded-tl-none leading-relaxed"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : msg.content ? (
                    parseMarkdown(msg.content)
                  ) : (
                    <span className="flex items-center gap-1.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8452C] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8452C] animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8452C] animate-bounce delay-300" />
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
            className="p-3 border-t border-[#27272A] bg-[#181818]/80 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanyakan tentang proyek atau stack..."
              disabled={isLoading}
              className="flex-1 bg-[#121212] border border-[#27272A] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#E8452C] focus:ring-1 focus:ring-[#E8452C] disabled:opacity-60 text-[#FAFAFA] placeholder-[#71717A]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#E8452C] hover:bg-[#d43c24] text-white disabled:opacity-40 transition-colors cursor-pointer shrink-0"
            >
              <svg className="w-3.5 h-3.5 rotate-90 stroke-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
