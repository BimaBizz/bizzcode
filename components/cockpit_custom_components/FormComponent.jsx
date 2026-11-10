"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function FormComponent({ data, className }) {
  const formKey = data?.formKey || "";
  const typeInput = Array.isArray(data?.typeInput) ? data.typeInput : [];

  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!formKey) {
    return (
      <div className="rounded-xl border border-dashed border-red-500/50 p-6 text-center text-xs font-mono text-red-400">
        Missing form configuration key (formKey).
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(e.target);

    try {
      const response = await fetch(`/api/inbox/submit/${formKey}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("success");
        e.target.reset();
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Koneksi gagal. Periksa jaringan Anda dan coba lagi.");
    }
  };

  return (
    <div className={cn("mx-auto w-full max-w-xl my-6", className)}>
      <div className="relative overflow-hidden rounded-xl border border-[#111111]/15 bg-[#FAF7F0] p-8 md:p-10 shadow-sm">
        {status === "success" ? (
          <div className="py-8 text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] border border-[#111111]">
              <svg className="h-6 w-6 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#111111]">Pesan Terkirim</h3>
            <p className="mt-2 text-xs text-[#57534E]">Terima kasih, pesan Anda telah berhasil diterima.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 rounded-lg bg-[#D9541E] hover:bg-[#BF4615] px-5 py-2.5 text-xs font-medium text-[#F3EEE3] transition-colors cursor-pointer"
            >
              Kirim pesan lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {typeInput.map((field, idx) => {
                const id = `form-field-${field.name}-${idx}`;
                const inputName = `data[${field.name}]`;
                const labelText = field.name.charAt(0).toUpperCase() + field.name.slice(1);

                if (field.type === "textarea") {
                  return (
                    <div key={id} className="flex flex-col gap-1.5">
                      <label htmlFor={id} className="text-[11px] uppercase font-mono font-semibold tracking-wider text-[#111111]">
                        {labelText}
                      </label>
                      <textarea
                        id={id}
                        name={inputName}
                        rows={4}
                        className="w-full rounded-lg border border-[#111111]/20 bg-[#F3EEE3] px-3.5 py-3 text-xs sm:text-sm text-[#111111] outline-none transition-all placeholder:text-[#78716C] focus:border-[#D9541E] focus:ring-1 focus:ring-[#D9541E]"
                        required
                      />
                    </div>
                  );
                }

                if (field.type === "checkbox") {
                  return (
                    <div key={id} className="flex items-center gap-2.5 py-1">
                      <input
                        id={id}
                        type="checkbox"
                        name={inputName}
                        value="yes"
                        className="h-4 w-4 rounded border-[#111111]/25 bg-[#F3EEE3] text-[#D9541E] focus:ring-[#D9541E]"
                      />
                      <label htmlFor={id} className="text-xs font-mono text-[#57534E] cursor-pointer select-none">
                        {labelText}
                      </label>
                    </div>
                  );
                }

                return (
                  <div key={id} className="flex flex-col gap-1.5">
                    <label htmlFor={id} className="text-[11px] uppercase font-mono font-semibold tracking-wider text-[#111111]">
                      {labelText}
                    </label>
                    <input
                      id={id}
                      type={field.type}
                      name={inputName}
                      className="w-full rounded-lg border border-[#111111]/20 bg-[#F3EEE3] px-3.5 py-3 text-xs sm:text-sm text-[#111111] outline-none transition-all placeholder:text-[#78716C] focus:border-[#D9541E] focus:ring-1 focus:ring-[#D9541E]"
                      required={field.type !== "password"}
                    />
                  </div>
                );
              })}
            </div>

            {status === "error" && (
              <div className="rounded-lg bg-red-950/10 p-3 text-xs text-red-700 border border-red-600/30">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className={cn(
                "w-full rounded-lg bg-[#D9541E] hover:bg-[#BF4615] text-[#F3EEE3] py-3 text-xs font-semibold shadow-md shadow-[#D9541E]/20 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4",
                status === "submitting" && "opacity-75 cursor-not-allowed"
              )}
            >
              {status === "submitting" ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-[#F3EEE3]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Mengirim...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
