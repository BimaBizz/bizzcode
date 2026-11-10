"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, RefreshCcw, AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main className="relative isolate overflow-hidden px-6 py-16 sm:py-24">
      <section className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-4xl flex-col items-center justify-center text-center">
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#111111]/15 bg-[#FAF7F0] px-3.5 py-1.5 text-xs font-mono tracking-widest text-[#57534E]">
          <span className="h-2 w-2 rounded-full bg-[#D9541E] animate-pulse" />
          SYSTEM_STATUS: 404_NOT_FOUND
        </div>

        {/* Header Block */}
        <div className="mt-8 space-y-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#D9541E]">
            Error 404
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111]">
            Route Not Found
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#57534E]">
            Halaman atau endpoint yang Anda tuju tidak ditemukan pada server.
          </p>
        </div>

        {/* Terminal Box */}
        <div className="mt-10 w-full max-w-2xl overflow-hidden rounded-xl border border-[#262626] bg-[#111111] text-left shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#262626] px-4 py-2.5 bg-[#1A1A1A]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3F3F46]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3F3F46]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3F3F46]" />
            </div>
            <span className="font-mono text-[11px] text-[#A8A29E]">
              bmdev@portfolio:~/routes
            </span>
            <div className="w-10" />
          </div>

          <div className="space-y-3 bg-[#111111] p-5 font-mono text-xs leading-relaxed text-[#F3EEE3]/85">
            <div className="flex items-center gap-2 text-[#F3EEE3]">
              <span className="text-[#D9541E]">$</span>
              <span>resolve-route --path current</span>
            </div>
            <p className="text-[#A8A29E]">
              Scanning internal filesystem routes...
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2 text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#D9541E]" />
              <span>[ERR_ROUTE_MISSING] Nilai path tidak cocok dengan page yang tersedia.</span>
            </div>
            <div className="pt-1 text-[#A8A29E]">
              <p className="text-[#F3EEE3] font-medium">Langkah rekomendasi:</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[#A8A29E]">
                <li>Periksa URL yang diminta di browser bar.</li>
                <li>Gunakan navigasi header atau kembali ke beranda.</li>
              </ul>
            </div>
            <div className="flex items-center gap-2 text-[#F3EEE3] pt-2">
              <span className="text-[#D9541E]">$</span>
              <span className="h-4 w-2 bg-[#D9541E] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#D9541E] hover:bg-[#BF4615] px-5 py-2.5 text-xs font-medium text-[#F3EEE3] transition-colors sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#111111] bg-[#111111] hover:bg-[#262626] px-5 py-2.5 text-xs font-medium text-[#F3EEE3] transition-colors sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#111111]/20 bg-[#FAF7F0] hover:bg-[#EBE4D5] px-5 py-2.5 text-xs font-medium text-[#111111] transition-colors sm:w-auto"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </Link>
        </div>
      </section>
    </main>
  );
}