import Image from "next/image";
import { getAssetImageUrl } from "@/lib/cockpit";

export default function CockpitImage({ asset, alt, width = 1200, height = 675, className, priority, loading }) {
  if (!asset?._id) {
    return null;
  }

  const src = getAssetImageUrl(asset, {
    width,
    height,
    quality: 82,
    mode: "bestFit",
    mime: "webp",
  });

  return (
    <Image
      src={src}
      alt={alt || asset.title || "Cockpit asset"}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={loading}
      unoptimized
    />
  );
}
