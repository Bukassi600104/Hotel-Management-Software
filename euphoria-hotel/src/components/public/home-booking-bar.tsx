"use client";

import { AvailabilityChecker } from "@/components/public/availability-checker";

export function HomeBookingBar() {
  return (
    <section className="relative z-20 -mt-16 px-4 sm:px-6 lg:px-15">
      <div className="mx-auto max-w-[1180px] border border-white/70 bg-[rgba(254,253,251,0.96)] p-3 shadow-[0_32px_90px_-42px_rgba(23,24,26,0.5)] backdrop-blur-xl">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="px-3 pt-3 lg:px-5 lg:pt-0">
            <p className="label-tag mb-2">Reservation</p>
            <h2 className="font-heading text-[28px] leading-none text-[var(--color-dark)] sm:text-[34px]">
              Check Availability
            </h2>
          </div>
          <AvailabilityChecker className="max-w-none rounded-none border-0 bg-transparent p-0 shadow-none" />
        </div>
        <div className="mt-3 grid border-t border-[#ece6dc] text-center text-[11px] uppercase tracking-[2px] text-[var(--color-text-light)] sm:grid-cols-3">
          <div className="px-4 py-3">24 hour reception</div>
          <div className="border-[#ece6dc] px-4 py-3 sm:border-x">Secure private parking</div>
          <div className="px-4 py-3">Premium rooms and suites</div>
        </div>
      </div>
    </section>
  );
}
