"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function FormComponent({ data, className }) {
  const formKey = data?.formKey || "";
  const typeInput = Array.isArray(data?.typeInput) ? data.typeInput : [];

  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState("");

  if (!formKey) {
    return (
      <div className="rounded-xl border border-dashed border-red-500 p-6 text-center text-red-500 dark:border-red-800">
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
      // Post to our local Next.js Route Handler proxy
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
        setErrorMessage(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className={cn("mx-auto w-full max-w-xl my-6", className)}>
      <div className="relative overflow-hidden rounded-tr-[40px] rounded-bl-[40px] rounded-tl-[8px] rounded-br-[8px] border border-[#1E3A2C] bg-[#0F221A] p-8 md:p-12 shadow-2xl">
        {status === "success" ? (
          <div className="py-8 text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F3D24]">
              <svg className="h-6 w-6 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold font-heading text-[#EAF6EF]">Thank you!</h3>
            <p className="mt-2 text-sm text-[#8FAB9C]">Your message has been sent successfully.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 rounded-[22px] hover:rounded-[10px] bg-[#4ADE80] hover:bg-[#3bc770] px-5 py-2.5 text-xs font-bold !text-[#062011] transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] cursor-pointer"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {typeInput.map((field, idx) => {
                const id = `form-field-${field.name}-${idx}`;
                const inputName = `data[${field.name}]`;
                const labelText = field.name.charAt(0).toUpperCase() + field.name.slice(1);

                if (field.type === "textarea") {
                  return (
                    <div key={id} className="flex flex-col gap-2">
                      <label htmlFor={id} className="text-[11.5px] uppercase font-bold tracking-wider text-[#8FAB9C]">
                        {labelText}
                      </label>
                      <textarea
                        id={id}
                        name={inputName}
                        rows={4}
                        className="w-full rounded-[14px] border border-[#1E3A2C] bg-[#152B21] px-4 py-3.5 text-sm text-[#EAF6EF] outline-none transition-all placeholder:text-[#8FAB9C]/60 focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80]"
                        required
                      />
                    </div>
                  );
                }

                if (field.type === "checkbox") {
                  return (
                    <div key={id} className="flex items-center gap-3 py-1">
                      <input
                        id={id}
                        type="checkbox"
                        name={inputName}
                        value="yes"
                        className="h-4.5 w-4.5 rounded border-[#1E3A2C] bg-[#152B21] text-[#4ADE80] focus:ring-[#4ADE80]"
                      />
                      <label htmlFor={id} className="text-xs uppercase font-semibold text-[#8FAB9C] cursor-pointer select-none">
                        {labelText}
                      </label>
                    </div>
                  );
                }

                return (
                  <div key={id} className="flex flex-col gap-2">
                    <label htmlFor={id} className="text-[11.5px] uppercase font-bold tracking-wider text-[#8FAB9C]">
                      {labelText}
                    </label>
                    <input
                      id={id}
                      type={field.type}
                      name={inputName}
                      className="w-full rounded-[14px] border border-[#1E3A2C] bg-[#152B21] px-4 py-3.5 text-sm text-[#EAF6EF] outline-none transition-all placeholder:text-[#8FAB9C]/60 focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80]"
                      required={field.type !== "password"}
                    />
                  </div>
                );
              })}
            </div>

            {status === "error" && (
              <div className="rounded-[14px] bg-red-950/30 p-3.5 text-xs text-red-400 border border-red-900/50">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className={cn(
                "w-full rounded-[26px] hover:rounded-[10px] bg-[#4ADE80] hover:bg-[#3bc770] !text-[#062011] py-4 text-sm font-bold shadow-lg shadow-[#4ADE80]/10 transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] cursor-pointer flex items-center justify-center gap-2 mt-4",
                status === "submitting" && "opacity-75 cursor-not-allowed"
              )}
            >
              {status === "submitting" ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-[#062011]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
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
