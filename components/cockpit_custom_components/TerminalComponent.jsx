"use client";

import { useEffect, useMemo, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/gml.min.css";

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
    <section className="h-130 flex flex-col overflow-hidden rounded-tr-[30px] rounded-bl-[30px] rounded-tl-[8px] rounded-br-[8px] border border-[#1E3A2C] bg-[#04100A] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between gap-2 border-b border-white/5 px-4 py-3 bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" aria-hidden="true" />
        </div>
        <span className="ml-3 font-mono text-xs tracking-wide text-[#8FAB9C]">zsh — 80x24</span>
      </div>

      <div className="terminal-content flex-1 overflow-x-auto overflow-y-auto p-6 font-mono text-sm leading-8 text-[#4ADE80]">
        <pre className="whitespace-pre-wrap wrap-break-word">
          <code className="hljs">
            <span dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
            <span className={`terminal-cursor ml-0.5 inline-block ${isTyping ? "text-[#4ADE80]" : "text-[#4ADE80]"}`}>
              <span className="ml-1 block h-1.5 w-3 bg-[#4ADE80]" />
            </span>
          </code>
        </pre>
      </div>

      <style jsx>{`
        .terminal-cursor {
          animation: terminal-cursor-blink 1s steps(1, end) infinite;
        }

        :global(.hljs) {
          background: transparent !important;
          padding: 0 !important;
        }

        @keyframes terminal-cursor-blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}