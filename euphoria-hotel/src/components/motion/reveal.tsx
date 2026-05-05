"use client";

import * as React from "react";
import { motion, useInView, type Variants, type HTMLMotionProps } from "motion/react";

import { fadeUp, fadeIn, scaleIn, blurUp, stagger, easeLuxe } from "@/lib/motion";

type Variant = "fade-up" | "fade" | "scale" | "blur";

const variantsMap: Record<Variant, Variants> = {
  "fade-up": fadeUp,
  fade: fadeIn,
  scale: scaleIn,
  blur: blurUp,
};

type RevealProps = Omit<HTMLMotionProps<"div">, "initial" | "animate" | "variants"> & {
  variant?: Variant;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
};

export function Reveal({
  variant = "fade-up",
  delay = 0,
  duration,
  once = true,
  amount = 0.2,
  children,
  ...rest
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });

  const baseVariants = variantsMap[variant];
  const merged: Variants = {
    hidden: baseVariants.hidden ?? {},
    visible: {
      ...((baseVariants.visible as object) ?? {}),
      transition: {
        ...(((baseVariants.visible as { transition?: object })?.transition) ?? {}),
        delay,
        ...(duration ? { duration } : {}),
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={merged}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = Omit<HTMLMotionProps<"div">, "initial" | "animate" | "variants"> & {
  delay?: number;
  step?: number;
  amount?: number;
};

export function StaggerGroup({
  delay = 0,
  step = 0.08,
  amount = 0.15,
  children,
  ...rest
}: StaggerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger(delay, step)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = Omit<HTMLMotionProps<"div">, "variants"> & {
  variant?: Variant;
};

export function StaggerItem({
  variant = "fade-up",
  children,
  ...rest
}: StaggerItemProps) {
  return (
    <motion.div variants={variantsMap[variant]} {...rest}>
      {children}
    </motion.div>
  );
}

export { easeLuxe };
