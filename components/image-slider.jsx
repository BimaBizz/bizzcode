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
      className="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden rounded-xl border border-[#27272A] bg-[#0A0A0A] shadow-xl group"
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
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-[#121212]/80 backdrop-blur-md text-[#FAFAFA] border border-[#27272A] hover:border-[#E8452C] transition-all opacity-0 group-hover:opacity-100 duration-200 cursor-pointer shadow-md"
            aria-label="Previous image"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-[#121212]/80 backdrop-blur-md text-[#FAFAFA] border border-[#27272A] hover:border-[#E8452C] transition-all opacity-0 group-hover:opacity-100 duration-200 cursor-pointer shadow-md"
            aria-label="Next image"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showControls && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 bg-[#121212]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#27272A]">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-[#E8452C] w-3.5" : "bg-[#3F3F46] w-1.5"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
