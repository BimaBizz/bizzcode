import { clsx } from "clsx";

// Fallback merge to keep className utility working when tailwind-merge
// cannot be resolved in constrained Node environments.
function twMergeFallback(value) {
  return value;
}

export function cn(...inputs) {
  return twMergeFallback(clsx(inputs));
}
