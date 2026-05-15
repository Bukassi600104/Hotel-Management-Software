"use client";

import * as React from "react";
import { Mail, Phone, Trash2, Check, ExternalLink } from "lucide-react";
import { formatDateShort } from "@/lib/format";

type Inquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  topic: string | null;
  message: string;
  source: string | null;
  is_read: boolean | null;
  created_at: string | null;
};

export function InquiriesClient() {
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<Inquiry | null>(null);
  const [unreadOnly, setUnreadOnly] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (unreadOnly) params.set("unread", "true");
    const data = await fetch(`/api/admin/inquiries?${params.toString()}`).then((r) => r.json());
    setInquiries(data.inquiries ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [unreadOnly]);

  React.useEffect(() => { load(); }, [load]);

  async function markRead(id: string) {
    await fetch(`/api/admin/inquiries?id=${id}`, { method: "PATCH" });
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, is_read: true } : i)));
    if (selected?.id === id) setSelected((s) => s ? { ...s, is_read: true } : s);
  }

  async function deleteInquiry(id: string) {
    if (!confirm("Delete this inquiry? This cannot be undone.")) return;
    await fetch(`/api/admin/inquiries?id=${id}`, { method: "DELETE" });
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function openInquiry(inquiry: Inquiry) {
    setSelected(inquiry);
    if (!inquiry.is_read) markRead(inquiry.id);
  }

  const sourceBadge = (source: string | null) =>
    source === "conference"
      ? "bg-purple-500/15 text-purple-300"
      : "bg-sky-500/15 text-sky-300";

  return (
    <div className="mt-5 flex gap-6 h-[calc(100vh-160px)]">
      {/* List */}
      <div className="w-full max-w-sm shrink-0 overflow-y-auto rounded-xl border border-white/8">
        {/* Filter */}
        <div className="sticky top-0 border-b border-white/8 bg-[#111316] px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-white/40">{total} total</span>
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
              unreadOnly ? "bg-[#c9a961] text-[#17181a] font-semibold" : "border border-white/10 text-white/50"
            }`}
          >
            Unread only
          </button>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-[#c9a961]" />
          </div>
        ) : inquiries.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-white/30">No inquiries found.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {inquiries.map((inq) => (
              <button
                key={inq.id}
                onClick={() => openInquiry(inq)}
                className={`w-full px-4 py-3 text-left transition-colors hover:bg-white/4 ${
                  selected?.id === inq.id ? "bg-white/6" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  {!inq.is_read && (
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#c9a961]" />
                  )}
                  <div className="min-w-0 flex-1" style={{ marginLeft: inq.is_read ? "10px" : undefined }}>
                    <p className={`truncate text-sm ${inq.is_read ? "text-white/60 font-normal" : "text-white/85 font-medium"}`}>
                      {inq.name}
                    </p>
                    <p className="truncate text-xs text-white/35">{inq.topic ?? inq.message.slice(0, 40)}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${sourceBadge(inq.source)}`}>
                        {inq.source === "conference" ? "Conference" : "Contact"}
                      </span>
                      {inq.created_at && (
                        <span className="text-[10px] text-white/25">
                          {formatDateShort(inq.created_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected ? (
        <div className="flex-1 overflow-y-auto rounded-xl border border-white/8 bg-white/3 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${sourceBadge(selected.source)}`}>
                  {selected.source === "conference" ? "Conference Enquiry" : "Contact Form"}
                </span>
                {selected.created_at && (
                  <span className="text-xs text-white/30">{formatDateShort(selected.created_at)}</span>
                )}
              </div>
              <h2 className="mt-2 text-lg font-semibold text-white">{selected.name}</h2>
              {selected.topic && <p className="text-sm text-white/50">{selected.topic}</p>}
            </div>
            <div className="flex gap-2">
              {!selected.is_read && (
                <button
                  onClick={() => markRead(selected.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:border-white/20"
                >
                  <Check className="size-3.5" />
                  Mark read
                </button>
              )}
              <button
                onClick={() => deleteInquiry(selected.id)}
                className="rounded-lg border border-red-500/20 p-1.5 text-red-400/50 hover:border-red-500/40 hover:text-red-400"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {selected.email && (
              <a
                href={`mailto:${selected.email}`}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:border-white/20 hover:text-white/80"
              >
                <Mail className="size-3.5" />
                {selected.email}
                <ExternalLink className="size-3" />
              </a>
            )}
            {selected.phone && (
              <a
                href={`tel:${selected.phone}`}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:border-white/20 hover:text-white/80"
              >
                <Phone className="size-3.5" />
                {selected.phone}
              </a>
            )}
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/30">Message</p>
            <div className="whitespace-pre-wrap rounded-xl border border-white/8 bg-white/3 p-4 text-sm leading-relaxed text-white/75">
              {selected.message}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-white/8 border-dashed">
          <p className="text-sm text-white/25">Select an inquiry to read it</p>
        </div>
      )}
    </div>
  );
}
