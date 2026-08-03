"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!Array.isArray(images) || images.length <= 1 || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [images, isHovered]);

  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const showControls = images.length > 1;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-lg group"
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
          >
            <Image
              src={img.src}
              alt={img.alt || "Slider Image"}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 1400px) 100vw, 1400px"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Prev / Next Buttons */}
      {showControls && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md text-zinc-900 dark:text-zinc-50 border border-white/20 hover:bg-white/50 dark:hover:bg-black/50 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 duration-300 shadow-sm"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md text-zinc-900 dark:text-zinc-50 border border-white/20 hover:bg-white/50 dark:hover:bg-black/50 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 duration-300 shadow-sm"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/20 dark:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white w-4" : "bg-white/50"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
