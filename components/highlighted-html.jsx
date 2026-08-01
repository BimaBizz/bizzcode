"use client";

import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/base16/brogrammer.min.css";

export default function HighlightedHtml({ html, className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // 1. Highlight code blocks
      const codeBlocks = containerRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        // Only highlight if not already highlighted
        if (!block.dataset.highlighted) {
          hljs.highlightElement(block);
        }
      });

      // 2. Inject Copy Button inside pre containers
      const preElements = containerRef.current.querySelectorAll("pre");
      preElements.forEach((pre) => {
        if (pre.querySelector(".copy-btn")) return; // Prevent duplicate buttons

        pre.classList.add("relative", "group");

        const button = document.createElement("button");
        button.className = "copy-btn absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 bg-zinc-900/90 hover:bg-[#138024] text-zinc-400 hover:text-white px-2.5 py-1 text-[10px] font-bold rounded-lg border border-zinc-800 hover:border-[#138024]/50 backdrop-blur-md cursor-pointer z-10 flex items-center gap-1.5 shadow-sm";
        button.type = "button";
        
        const copyIcon = `<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>`;
        const checkIcon = `<svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`;
        
        button.innerHTML = `${copyIcon}<span>Copy</span>`;

        button.addEventListener("click", () => {
          const code = pre.querySelector("code");
          if (!code) return;
          
          navigator.clipboard.writeText(code.innerText).then(() => {
            button.innerHTML = `${checkIcon}<span>Copied!</span>`;
            button.classList.add("border-emerald-500/50", "text-emerald-400");
            
            setTimeout(() => {
              button.innerHTML = `${copyIcon}<span>Copy</span>`;
              button.classList.remove("border-emerald-500/50", "text-emerald-400");
            }, 2000);
          }).catch(err => {
            console.error("Clipboard copy failed: ", err);
          });
        });

        pre.appendChild(button);
      });
    }
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
