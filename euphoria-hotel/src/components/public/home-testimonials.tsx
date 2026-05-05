import { Star } from "lucide-react";

import { testimonials } from "@/lib/data/testimonials";

export function HomeTestimonials() {
  return (
    <section className="bg-[var(--color-dark)] px-6 py-[60px] text-white md:px-15 md:py-[100px]">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-12 text-center">
          <p className="label-tag mb-4">Reservation</p>
          <h2 className="font-heading text-[clamp(36px,5vw,64px)] font-normal leading-[1.15]">
            Guest Reviews
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.id} className="border border-white/10 bg-white/[0.04] p-8">
              <div className="mb-5 flex gap-1 text-[var(--color-gold)]">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-sm font-light leading-[1.8] text-white/75">
                {item.body}
              </p>
              <div className="mt-7">
                <h3 className="font-heading text-2xl text-white">{item.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-[3px] text-[var(--color-gold)]">
                  Customer
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
