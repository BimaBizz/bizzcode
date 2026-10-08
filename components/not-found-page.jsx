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
        <div className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#121212] px-3.5 py-1.5 text-xs font-mono tracking-widest text-[#A1A1AA]">
          <span className="h-2 w-2 rounded-full bg-[#E8452C] animate-pulse" />
          SYSTEM_STATUS: 404_NOT_FOUND
        </div>

        {/* Header Block */}
        <div className="mt-8 space-y-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#E8452C]">
            Error 404
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#FAFAFA]">
            Route Not Found
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#A1A1AA]">
            Halaman atau endpoint yang Anda tuju tidak ditemukan pada server.
          </p>
        </div>

        {/* Terminal Box */}
        <div className="mt-10 w-full max-w-2xl overflow-hidden rounded-xl border border-[#27272A] bg-[#121212] text-left shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#27272A] px-4 py-2.5 bg-[#181818]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3F3F46]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3F3F46]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3F3F46]" />
            </div>
            <span className="font-mono text-[11px] text-[#71717A]">
              bmdev@portfolio:~/routes
            </span>
            <div className="w-10" />
          </div>

          <div className="space-y-3 bg-[#0A0A0A] p-5 font-mono text-xs leading-relaxed text-[#D4D4D8]">
            <div className="flex items-center gap-2 text-[#FAFAFA]">
              <span className="text-[#E8452C]">$</span>
              <span>resolve-route --path current</span>
            </div>
            <p className="text-[#71717A]">
              Scanning internal filesystem routes...
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2 text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#E8452C]" />
              <span>[ERR_ROUTE_MISSING] Nilai path tidak cocok dengan page yang tersedia.</span>
            </div>
            <div className="pt-1 text-[#A1A1AA]">
              <p className="text-[#FAFAFA] font-medium">Langkah rekomendasi:</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[#A1A1AA]">
                <li>Periksa URL yang diminta di browser bar.</li>
                <li>Gunakan navigasi header atau kembali ke beranda.</li>
              </ul>
            </div>
            <div className="flex items-center gap-2 text-[#FAFAFA] pt-2">
              <span className="text-[#E8452C]">$</span>
              <span className="h-4 w-2 bg-[#E8452C] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#E8452C] hover:bg-[#d43c24] px-5 py-2.5 text-xs font-medium text-white transition-colors sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#27272A] bg-[#181818] hover:bg-[#202020] px-5 py-2.5 text-xs font-medium text-[#FAFAFA] transition-colors sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#27272A] bg-[#121212] hover:bg-[#181818] px-5 py-2.5 text-xs font-medium text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors sm:w-auto"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </Link>
        </div>
      </section>
    </main>
  );
}