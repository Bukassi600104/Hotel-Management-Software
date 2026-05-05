"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll } from "motion/react";
import { ArrowUp, MessageCircle } from "lucide-react";

import { siteConfig } from "@/lib/site";

export function FloatingActions() {
  const [showTop, setShowTop] = React.useState(false);
  const { scrollY } = useScroll();

  React.useEffect(() => {
    return scrollY.on("change", (y) => setShowTop(y > 600));
  }, [scrollY]);

  const waMessage = encodeURIComponent(
    "Hello Euphoria Hotel, I would like to enquire about a stay."
  );
  const waHref = `https://wa.me/${siteConfig.contact.whatsapp}?text=${waMessage}`;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="totop"
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            aria-label="Scroll to top"
            className="pointer-events-auto grid size-11 place-items-center rounded-full bg-[var(--color-charcoal)] text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] hover:bg-[var(--color-charcoal-soft)] transition-colors"
          >
            <ArrowUp className="size-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_36px_-8px_rgba(37,211,102,0.6)]"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring"
        />
        <MessageCircle className="relative size-6" />
      </motion.a>
    </div>
  );
}
