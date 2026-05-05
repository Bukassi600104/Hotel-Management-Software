"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import * as React from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { menu, menuCategories } from "@/lib/data/menu";
import { formatNaira } from "@/lib/format";
import type { MenuItem } from "@/types";

export function MenuTabs() {
  const [active, setActive] = React.useState<string>(menuCategories[0].id);

  return (
    <Tabs value={active} onValueChange={setActive} className="w-full">
      <TabsList className="mx-auto flex w-full max-w-2xl flex-wrap justify-center gap-1 border border-[#e8dfd1] bg-[#fffdf8] p-1.5 shadow-[0_18px_50px_-34px_rgba(23,24,26,0.35)]">
        {menuCategories.map((c) => (
          <TabsTrigger
            key={c.id}
            value={c.id}
            className="flex-1 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] data-[state=active]:bg-[var(--color-charcoal)] data-[state=active]:text-white"
          >
            {c.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {menuCategories.map((c) => (
        <TabsContent key={c.id} value={c.id} className="mt-12">
          <AnimatePresence mode="wait">
            {active === c.id && (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {menu
                  .filter((m) => m.category === c.id)
                  .map((item, idx) => (
                    <DishCard key={item.id} item={item} index={idx} />
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function DishCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group overflow-hidden border border-[#e8dfd1] bg-[#fffdf8] transition-all hover:-translate-y-1 hover:border-[var(--color-gold)] hover:shadow-[0_30px_80px_-42px_rgba(23,24,26,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 24rem, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute right-4 top-4 bg-white/95 px-4 py-2 text-right text-charcoal shadow-[0_16px_36px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <div className="text-[8px] uppercase tracking-[2px] text-[var(--color-gold-dark)]">
            Price
          </div>
          <div className="font-heading text-2xl leading-none tabular-nums">
            {formatNaira(item.price)}
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-heading text-xl tracking-tight">{item.name}</h3>
        <div className="luxe-divider mt-3 opacity-50" />
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </motion.article>
  );
}
