import Image from "next/image";

import { cn } from "@/lib/utils";
import { HOTEL_LOGO } from "@/lib/site";

type Props = {
  height?: number;
  className?: string;
  /** Use brightness filter to render the logo white on dark backgrounds. */
  invert?: boolean;
};

/**
 * Hilton Euphoria Hotel — official wordmark + winged-H badge,
 * loaded directly from the property's CDN.
 */
export function BrandLogo({ height = 44, className, invert = false }: Props) {
  return (
    <Image
      src={HOTEL_LOGO}
      alt="Hilton Euphoria Hotel"
      width={Math.round(height * 4)}
      height={height}
      preload
      fetchPriority="high"
      quality={85}
      sizes={`${Math.round(height * 4)}px`}
      style={{ height, width: "auto" }}
      className={cn(
        "object-contain transition-[height] duration-400",
        invert && "invert-logo",
        className
      )}
    />
  );
}
