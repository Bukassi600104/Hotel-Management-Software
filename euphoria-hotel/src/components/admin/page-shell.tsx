import type * as React from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function AdminPageShell({ title, description, action, children, className }: PageShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8", className)}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#c9a961]/68">Hotel dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#151515] md:text-3xl">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f6757]">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export const adminPanelClass =
  "rounded-[1.35rem] border border-[#eadfca] bg-white shadow-[0_20px_70px_rgba(33,25,12,0.06)] backdrop-blur";

export const adminInputClass =
  "w-full rounded-xl border border-[#eadfca] bg-[#fffdf8] px-3.5 py-2.5 text-sm text-[#151515] outline-none transition placeholder:text-[#9f9686] focus:border-[#c9a961]/55 focus:ring-2 focus:ring-[#c9a961]/15";

export const adminButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#c9a961] px-4 py-2.5 text-xs font-semibold text-[#17181a] transition hover:bg-[#d4bc96] disabled:opacity-55";

export const adminGhostButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#eadfca] bg-white px-4 py-2.5 text-xs font-medium text-[#6f6757] transition hover:border-[#c9a961]/45 hover:bg-[#fbf6eb] hover:text-[#151515] disabled:opacity-45";
