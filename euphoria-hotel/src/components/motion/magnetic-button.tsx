"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"button"> & {
  strength?: number;
};

export function MagneticButton({
  className,
  children,
  strength = 0.3,
  ...rest
}: Props) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 240, damping: 22, mass: 0.6 });

  function onMove(e: React.MouseEvent<HTMLButtonElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(dx);
    y.set(dy);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cn("inline-flex items-center", className)}
      {...(rest as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
