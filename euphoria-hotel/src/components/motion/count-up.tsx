"use client";

import * as React from "react";
import { animate, useInView } from "motion/react";

type Props = {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  useGrouping?: boolean;
};

export function CountUp({
  to,
  from = 0,
  duration = 1.8,
  prefix = "",
  suffix = "",
  className,
  useGrouping = true,
}: Props) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  React.useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        const v = Math.round(value);
        const formatted = useGrouping ? v.toLocaleString() : String(v);
        node.textContent = `${prefix}${formatted}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, from, to, duration, prefix, suffix, useGrouping]);

  const initialFormatted = useGrouping ? from.toLocaleString() : String(from);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {initialFormatted}
      {suffix}
    </span>
  );
}
