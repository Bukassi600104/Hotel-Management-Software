"use client";

import * as React from "react";
import { Save, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Settings = {
  hotel_name: string;
  short_name: string;
  tagline: string;
  email: string;
  address: string;
  address_short: string;
  phone_reservation: string;
  phone_front_desk: string;
  phone_concierge: string;
  phone_events: string;
  whatsapp: string;
  check_in_time: string;
  check_out_time: string;
  vat_rate: number;
  cancellation_policy: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<Settings | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setSettings(data);
      })
      .catch(() => setError("Failed to load settings."))
      .finally(() => setLoading(false));
  }, []);

  function update(key: keyof Settings, value: string | number) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setSaved(true);
      toast.success("Settings saved.");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-white/30" />
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-sm text-red-300">
            {error ?? "Could not load settings."} — Make sure the{" "}
            <code className="text-red-200">settings</code> table exists in Supabase.
            See the SQL below to create it.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-3 text-[11px] text-white/60">
{`CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hotel_name text NOT NULL DEFAULT 'Hilton Euphoria Hotel',
  short_name text NOT NULL DEFAULT 'Hilton Euphoria',
  tagline text NOT NULL DEFAULT 'Unparalleled Comfort and Extraordinary Hospitality',
  email text NOT NULL DEFAULT 'booking@hiltoneuphoriahotel.com',
  address text NOT NULL DEFAULT 'Plot 18, 21/22 Road, Gowon Estate, Egbeda, Lagos State, Nigeria',
  address_short text NOT NULL DEFAULT 'Gowon Estate, Egbeda, Lagos',
  phone_reservation text NOT NULL DEFAULT '+234 806 026 0260',
  phone_front_desk text NOT NULL DEFAULT '+234 808 081 4342',
  phone_concierge text NOT NULL DEFAULT '+234 905 973 7707',
  phone_events text NOT NULL DEFAULT '+234 809 999 0143',
  whatsapp text NOT NULL DEFAULT '2348060260260',
  check_in_time text NOT NULL DEFAULT '3:00 PM',
  check_out_time text NOT NULL DEFAULT '12:00 PM',
  vat_rate numeric(5,2) NOT NULL DEFAULT 7.5,
  cancellation_policy text NOT NULL DEFAULT 'Free cancellation up to 48 hours before check-in. Cancellations within 48 hours are subject to a one-night charge.',
  updated_at timestamptz DEFAULT now()
);
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
      <p className="mt-1 text-sm text-white/40">
        Hotel information shown on the public site and in emails.
      </p>

      <form onSubmit={handleSave} className="mt-6 max-w-xl space-y-5">
        <Section title="Hotel identity">
          <Field label="Hotel name">
            <input
              type="text"
              value={settings.hotel_name}
              onChange={(e) => update("hotel_name", e.target.value)}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Short name">
            <input
              type="text"
              value={settings.short_name}
              onChange={(e) => update("short_name", e.target.value)}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Tagline">
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              required
              className={inputCls}
            />
          </Field>
        </Section>

        <Section title="Contact">
          <Field label="Booking email">
            <input
              type="email"
              value={settings.email}
              onChange={(e) => update("email", e.target.value)}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Address (full)">
            <input
              type="text"
              value={settings.address}
              onChange={(e) => update("address", e.target.value)}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Address (short)">
            <input
              type="text"
              value={settings.address_short}
              onChange={(e) => update("address_short", e.target.value)}
              required
              className={inputCls}
            />
          </Field>
          <Field label="WhatsApp number (digits only)">
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              required
              className={inputCls}
            />
          </Field>
        </Section>

        <Section title="Phone lines">
          <Field label="Reservation">
            <input type="text" value={settings.phone_reservation} onChange={(e) => update("phone_reservation", e.target.value)} required className={inputCls} />
          </Field>
          <Field label="Front Desk">
            <input type="text" value={settings.phone_front_desk} onChange={(e) => update("phone_front_desk", e.target.value)} required className={inputCls} />
          </Field>
          <Field label="Concierge">
            <input type="text" value={settings.phone_concierge} onChange={(e) => update("phone_concierge", e.target.value)} required className={inputCls} />
          </Field>
          <Field label="Events">
            <input type="text" value={settings.phone_events} onChange={(e) => update("phone_events", e.target.value)} required className={inputCls} />
          </Field>
        </Section>

        <Section title="Operations">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Check-in time">
              <input type="text" value={settings.check_in_time} onChange={(e) => update("check_in_time", e.target.value)} required className={inputCls} />
            </Field>
            <Field label="Check-out time">
              <input type="text" value={settings.check_out_time} onChange={(e) => update("check_out_time", e.target.value)} required className={inputCls} />
            </Field>
          </div>
          <Field label="VAT rate (%)">
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.vat_rate}
              onChange={(e) => update("vat_rate", parseFloat(e.target.value))}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Cancellation policy">
            <textarea
              rows={3}
              value={settings.cancellation_policy}
              onChange={(e) => update("cancellation_policy", e.target.value)}
              required
              className={`${inputCls} resize-none`}
            />
          </Field>
        </Section>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#c9a961] px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#17181a] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : saved ? (
              <Check className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            {saved ? "Saved" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/4 px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#c9a961]/40 focus:outline-none focus:ring-1 focus:ring-[#c9a961]/20 transition-colors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#c9a961]/70">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-white/45">{label}</label>
      {children}
    </div>
  );
}
