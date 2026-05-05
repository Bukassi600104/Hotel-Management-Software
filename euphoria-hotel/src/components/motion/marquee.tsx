"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
};

export function Marquee({
  children,
  speed = 40,
  className,
  pauseOnHover = true,
  reverse = false,
}: Props) {
  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        className
      )}
      style={{ ["--marquee-speed" as string]: `${speed}s` }}
    >
      <div
        className={cn(
          "flex shrink-0 gap-6 pr-6 will-change-transform",
          reverse ? "animate-[marquee_var(--marquee-speed)_linear_infinite_reverse]" : "animate-[marquee_var(--marquee-speed)_linear_infinite]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
