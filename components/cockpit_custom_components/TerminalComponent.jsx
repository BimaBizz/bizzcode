"use client";

import { useEffect, useMemo, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/tokyo-night-dark.min.css";

const htmlToTerminalText = (html = "") =>
  String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export default function TerminalComponent({ data }) {
  const promptHtml = typeof data?.prompt === "string" ? data.prompt.trim() : "";
  const text = useMemo(() => htmlToTerminalText(promptHtml), [promptHtml]);
  const [typed, setTyped] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const highlightedHtml = useMemo(() => {
    if (!typed) return "";
    try {
      return hljs.highlightAuto(typed).value;
    } catch (err) {
      console.error("Syntax highlighting failed:", err);
      return typed;
    }
  }, [typed]);

  useEffect(() => {
    const typingDelay = 14;
    const restartDelay = 10000;
    let timeoutId;
    let isCancelled = false;

    if (!text) {
      timeoutId = window.setTimeout(() => {
        setTyped("");
        setIsTyping(false);
      }, 0);

      return () => {
        isCancelled = true;
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timeoutId = window.setTimeout(() => {
        setTyped(text);
        setIsTyping(false);
      }, 0);

      return () => {
        isCancelled = true;
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    const startCycle = () => {
      if (isCancelled) return;

      setTyped("");
      setIsTyping(true);

      let currentIndex = 0;

      const typeNext = () => {
        if (isCancelled) return;

        currentIndex += 1;
        setTyped(text.slice(0, currentIndex));

        if (currentIndex < text.length) {
          timeoutId = window.setTimeout(typeNext, typingDelay);
          return;
        }

        setIsTyping(false);
        timeoutId = window.setTimeout(startCycle, restartDelay);
      };

      timeoutId = window.setTimeout(typeNext, typingDelay);
    };

    timeoutId = window.setTimeout(startCycle, 0);

    return () => {
      isCancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [text]);

  if (!promptHtml) {
    return null;
  }

  return (
    <section className="h-130 flex flex-col overflow-hidden rounded-xl border border-[#27272A] bg-[#0D0D10] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#27272A] px-4 py-2.5 bg-[#181818]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3F3F46]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3F3F46]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3F3F46]" aria-hidden="true" />
        </div>
        <span className="font-mono text-xs tracking-wide text-[#71717A]">bmdev@terminal:~/init</span>
        <div className="w-10" />
      </div>

      <div className="terminal-content flex-1 overflow-x-auto overflow-y-auto p-6 font-mono text-xs sm:text-sm leading-relaxed text-[#FAFAFA]">
        <pre className="whitespace-pre-wrap wrap-break-word">
          <code className="hljs">
            <span dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
            <span className="terminal-cursor ml-1 inline-block align-middle">
              <span className="block h-4 w-2 bg-[#E8452C]" />
            </span>
          </code>
        </pre>
      </div>

      <style jsx>{`
        .terminal-cursor {
          animation: terminal-cursor-blink 1.1s steps(1) infinite;
        }

        :global(.hljs) {
          background: transparent !important;
          padding: 0 !important;
        }

        @keyframes terminal-cursor-blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}