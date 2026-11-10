"use client";

import { useState, useEffect, useRef } from "react";
import { BMDevMark } from "@/components/ui/bmdev-logo";

const QUICK_PROMPTS = [
  "Apa saja layanan BMDev?",
  "Lihat proyek terbaru",
  "Tech stack yang dikuasai",
];

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Halo! Saya asisten AI BMDev. Tanyakan apa saja seputar portofolio proyek, arsitektur teknis, atau layanan pembuatan website.",
};

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
          cardHtml += '<div class="p-2.5 bg-[#F3EEE3] border border-[#111111]/15 rounded-lg space-y-1">';
          for (let j = 0; j < Math.max(headers.length, row.length); j++) {
            const header = headers[j] || "Info";
            const cell = row[j] || "-";
            cardHtml += `<div><span class="text-[#57534E] font-mono block text-[9px] uppercase tracking-wider">${header}</span><span class="text-[#111111] text-xs">${cell}</span></div>`;
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
      cardHtml += '<div class="p-2.5 bg-[#F3EEE3] border border-[#111111]/15 rounded-lg space-y-1">';
      for (let j = 0; j < Math.max(headers.length, row.length); j++) {
        const header = headers[j] || "Info";
        const cell = row[j] || "-";
        cardHtml += `<div><span class="text-[#57534E] font-mono block text-[9px] uppercase tracking-wider">${header}</span><span class="text-[#111111] text-xs">${cell}</span></div>`;
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
    return `<a href="${cleanUrl}" ${target} class="text-[#D9541E] hover:underline font-medium">${label}</a>`;
  });

  // 4. Parse auto-links <url>
  parsedText = parsedText.replace(/&lt;(https?:\/\/[^&>]+)&gt;/g, (match, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#D9541E] hover:underline font-medium">${url}</a>`;
  });

  // 5. Parse bold text **bold**
  parsedText = parsedText.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-[#111111] font-semibold">$1</strong>');

  // 6. Parse inline code `code`
  parsedText = parsedText.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-[#EBE4D5] text-[#111111] border border-[#111111]/15 rounded font-mono text-[10px]">$1</code>');

  // 7. Parse bullet points
  parsedText = parsedText.replace(/^(?:\s*)[-*•]\s+(.+)$/gm, '<li class="ml-4 list-disc text-[#57534E]">$1</li>');

  return <div dangerouslySetInnerHTML={{ __html: parsedText }} className="space-y-1" />;
};

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatUidRef = useRef(null);

  useEffect(() => {
    chatUidRef.current = "chat-" + Math.random().toString(36).substring(2, 11);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const sendPrompt = async (promptText) => {
    const trimmed = String(promptText || "").trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: "user", content: trimmed };
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

  const handleSend = (e) => {
    e.preventDefault();
    sendPrompt(inputValue);
  };

  const handleReset = () => {
    if (isLoading) return;
    chatUidRef.current = "chat-" + Math.random().toString(36).substring(2, 11);
    setMessages([INITIAL_MESSAGE]);
    setInputValue("");
  };

  return (
    <>
      {/* Floating Chat Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 rounded-full border transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none shadow-xl ${
          isOpen
            ? "h-11 w-11 justify-center bg-[#111111] border-[#111111] text-[#F3EEE3] hover:bg-[#D9541E] hover:border-[#D9541E]"
            : "h-12 pl-3 pr-4 bg-[#111111] border-[#111111]/90 text-[#F3EEE3] hover:border-[#D9541E] group"
        }`}
        aria-label={isOpen ? "Tutup Asisten AI" : "Tanya Asisten AI"}
      >
        {isOpen ? (
          <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#D9541E] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                />
              </svg>
            </span>
            <span className="flex flex-col items-start leading-none">
              <span className="text-[11px] font-semibold tracking-tight text-[#F3EEE3]">
                Tanya AI
              </span>
              <span className="text-[9px] font-mono text-[#F3EEE3]/65 uppercase tracking-wider mt-0.5">
                BMDev Agent
              </span>
            </span>
          </>
        )}
      </button>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] h-[520px] max-h-[calc(100vh-7rem)] bg-[#F3EEE3] border border-[#111111]/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#111111]/12 flex items-center justify-between bg-[#FAF7F0]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#111111] shadow-[2px_2px_0px_#D9541E] flex items-center justify-center p-1 text-[#F3EEE3] shrink-0">
                <BMDevMark className="w-5 h-5 text-[#F3EEE3]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-[#111111] tracking-tight">
                    BMDev Assistant
                  </h4>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EBE4D5] border border-[#111111]/10 px-2 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-[#111111]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9541E] animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-[#57534E] font-mono mt-0.5">
                  Portfolio & Technical Guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading}
                  title="Reset percakapan"
                  className="p-1.5 rounded-lg text-[#57534E] hover:text-[#111111] hover:bg-[#EBE4D5] transition-colors cursor-pointer disabled:opacity-40"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup chat"
                className="p-1.5 rounded-lg text-[#57534E] hover:text-[#111111] hover:bg-[#EBE4D5] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F3EEE3]">
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#78716C] mb-1 px-1">
                    {isUser ? "Anda" : "BMDev AI"}
                  </span>
                  <div
                    className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-xs break-words ${
                      isUser
                        ? "bg-[#111111] text-[#F3EEE3] rounded-tr-sm font-normal shadow-sm"
                        : "bg-[#FAF7F0] text-[#111111] border border-[#111111]/12 rounded-tl-sm leading-relaxed shadow-xs"
                    }`}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {isUser ? (
                      msg.content
                    ) : msg.content ? (
                      parseMarkdown(msg.content)
                    ) : (
                      <span className="flex items-center gap-1.5 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9541E] animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9541E] animate-bounce delay-150" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9541E] animate-bounce delay-300" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick Starter Prompts */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-1 space-y-1.5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] px-1">
                  Pertanyaan Cepat
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendPrompt(prompt)}
                      className="text-left text-[11px] font-medium px-3 py-1.5 rounded-xl bg-[#FAF7F0] hover:bg-[#EBE4D5] text-[#111111] border border-[#111111]/15 hover:border-[#D9541E] transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-[#111111]/12 bg-[#FAF7F0]"
          >
            <div className="flex items-center gap-2 rounded-xl bg-[#F3EEE3] border border-[#111111]/15 px-3 py-1.5 focus-within:border-[#D9541E] focus-within:ring-1 focus-within:ring-[#D9541E] transition-all">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tulis pertanyaan Anda..."
                disabled={isLoading}
                className="flex-1 bg-transparent py-1 text-xs focus:outline-none disabled:opacity-60 text-[#111111] placeholder-[#78716C]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Kirim pesan"
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#D9541E] hover:bg-[#BF4615] text-white disabled:opacity-35 transition-colors cursor-pointer shrink-0"
              >
                <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
