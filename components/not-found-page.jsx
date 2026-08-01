"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Home,
  RefreshCcw,
  TriangleAlert,
} from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main className="relative isolate overflow-hidden px-6 py-10 sm:px-8 sm:py-14">
      
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/75 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-foreground/60 shadow-sm backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-amber-800 animate-pulse" />
          SYSTEM_STATUS: DISCONNECTED
        </div>

        <div className="mt-8 space-y-5">
          <p className="font-heading text-[clamp(4rem,16vw,8.5rem)] font-black tracking-[-0.08em] text-foreground/10">
            404
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#136e00]">
            Error 404
          </p>
          <h1 className="font-heading text-4xl font-black tracking-[-0.06em] text-foreground sm:text-5xl md:text-7xl">
            Logic Not Found
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">
            Halaman yang Anda cari tidak ditemukan, sudah pindah, atau memang
            tidak pernah ada. Server mengembalikan rute kosong.
          </p>
        </div>

        <div className="mt-12 w-full lg:w-[70%] overflow-hidden rounded-[2rem] border border-border/70 bg-white/75 text-left shadow-[0_30px_80px_rgba(19,30,21,0.12)] backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ba1a1a]/40" />
              <span className="h-3 w-3 rounded-full bg-[#7c5357]/40" />
              <span className="h-3 w-3 rounded-full bg-[#136e00]/40" />
            </div>
            <div className="flex-1 text-center text-[11px] font-mono tracking-[0.24em] text-foreground/45 sm:text-xs">
              guest@architect:~/portfolio/404
            </div>
            <div className="w-12" />
          </div>

          <div className="space-y-4 bg-[#191c1d] p-5 font-mono text-sm leading-relaxed text-[#f0f1f2] sm:p-6 sm:text-base">
            <div className="flex items-center gap-3 text-[#4af626]">
              <span className="text-lg">$</span>
              <span>ls /requested-route</span>
            </div>
            <p className="text-[#f0f1f2]/70">
              Mencari entry point yang cocok di filesystem...
            </p>
            <div className="flex items-center gap-3 rounded-2xl border border-[#bbccb0]/20 bg-white/5 px-4 py-3 text-[#ffdad6]">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>[CRITICAL] 404: ENTRY_NOT_FOUND</span>
            </div>
            <div>
              <p className="text-[#4af626]">Possible solutions:</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-[#f0f1f2]/75">
                <li>Periksa kembali URL yang Anda buka.</li>
                <li>Kembali ke halaman utama.</li>
                <li>Gunakan tombol back jika ini salah klik.</li>
              </ol>
            </div>
            <div className="flex items-center gap-3 text-[#4af626]">
              <span className="text-lg">$</span>
              <span className="h-5 w-2 animate-pulse bg-[#4af626]" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#136e00] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#136e00]/20 transition hover:-translate-y-0.5 hover:bg-[#0f5d00] sm:w-auto"
          >
            <Home className="h-5 w-5" />
            Return Home
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border/80 bg-white/75 px-8 py-4 text-base font-semibold text-foreground shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border/80 bg-white/55 px-8 py-4 text-base font-semibold text-foreground/80 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white sm:w-auto"
          >
            <RefreshCcw className="h-5 w-5" />
            Retry Route
          </Link>
        </div>

        <p className="mt-8 max-w-xl text-sm text-foreground/50">
          Jika Anda membuka halaman yang seharusnya ada, cek ulang slug atau
          kembali ke beranda untuk mencari jalur yang benar.
        </p>
      </section>

      <div className="pointer-events-none absolute bottom-10 right-8 hidden opacity-10 lg:block">
        <div className="font-heading text-[12rem] font-black tracking-[-0.1em] text-foreground/20">
          404
        </div>
      </div>
    </main>
  );
}