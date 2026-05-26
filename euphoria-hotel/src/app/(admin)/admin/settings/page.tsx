"use client";

import * as React from "react";
import { Save, Check, Loader2, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  AdminPageShell,
  adminButtonClass,
  adminInputClass,
  adminPanelClass,
} from "@/components/admin/page-shell";
import { createClient } from "@/lib/supabase/client";

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
  const [passwordState, setPasswordState] = React.useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = React.useState(false);
  const [changingPassword, setChangingPassword] = React.useState(false);

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

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    const currentPassword = passwordState.current.trim();
    const nextPassword = passwordState.next.trim();
    const confirmPassword = passwordState.confirm.trim();

    if (!currentPassword || !nextPassword || !confirmPassword) {
      toast.error("Enter your current password and the new password.");
      return;
    }
    if (nextPassword !== confirmPassword) {
      toast.error("The new passwords do not match.");
      return;
    }
    if (nextPassword.length < 12) {
      toast.error("Use at least 12 characters for the new password.");
      return;
    }
    if (!/[a-z]/.test(nextPassword) || !/[A-Z]/.test(nextPassword) || !/\d/.test(nextPassword) || !/[^A-Za-z0-9]/.test(nextPassword)) {
      toast.error("Use uppercase, lowercase, a number, and a symbol.");
      return;
    }
    if (nextPassword === currentPassword) {
      toast.error("Choose a new password that is different from the current password.");
      return;
    }

    setChangingPassword(true);
    try {
      const { prefix, suffix } = await getSha1Parts(nextPassword);
      const breachResponse = await fetch("/api/admin/password/breach-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sha1Prefix: prefix, sha1Suffix: suffix }),
      });
      const breachData = await breachResponse.json();

      if (!breachResponse.ok) {
        throw new Error(breachData.error ?? "Could not verify password safety.");
      }
      if (breachData.compromised) {
        throw new Error(
          `This password appears in known breach datasets${breachData.count ? ` (${breachData.count.toLocaleString()} times)` : ""}. Choose a unique password.`
        );
      }

      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        throw new Error("Your admin session has expired. Please sign in again.");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect.");
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: nextPassword,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      setPasswordState({ current: "", next: "", confirm: "" });
      toast.success("Password changed. Use the new password next time you sign in.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Password change failed.");
    } finally {
      setChangingPassword(false);
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
      <AdminPageShell title="Settings" description="Hotel information shown on the public site and in email templates.">
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
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell title="Settings" description="Hotel information shown on the public site and in email templates.">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
        <form id="hotel-settings-form" onSubmit={handleSave} className="space-y-5">
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
        </form>
        </div>

        <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <div className={`${adminPanelClass} p-5`}>
            <p className="text-sm font-semibold text-white/88">Publishing controls</p>
            <p className="mt-2 text-sm leading-6 text-white/42">
              Changes update the public hotel details and the operational defaults used by the booking engine.
            </p>
          <button
            type="submit"
            form="hotel-settings-form"
            disabled={saving}
            className={`${adminButtonClass} mt-5 w-full`}
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

          <form onSubmit={handlePasswordChange} className={`${adminPanelClass} p-5`}>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#c9a961]/14 text-[#c9a961]">
                <KeyRound className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white/88">Change admin password</p>
                <p className="mt-1 text-sm leading-6 text-white/42">
                  Update this password regularly so only authorized hotel team members can access the admin area.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <PasswordField
                label="Current password"
                value={passwordState.current}
                show={showPasswords}
                onChange={(value) => setPasswordState((prev) => ({ ...prev, current: value }))}
              />
              <PasswordField
                label="New password"
                value={passwordState.next}
                show={showPasswords}
                autoComplete="new-password"
                onChange={(value) => setPasswordState((prev) => ({ ...prev, next: value }))}
              />
              <PasswordField
                label="Confirm new password"
                value={passwordState.confirm}
                show={showPasswords}
                autoComplete="new-password"
                onChange={(value) => setPasswordState((prev) => ({ ...prev, confirm: value }))}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowPasswords((value) => !value)}
              className="mt-3 inline-flex items-center gap-2 text-xs text-white/45 hover:text-white/75"
            >
              {showPasswords ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              {showPasswords ? "Hide passwords" : "Show passwords"}
            </button>

            <div className="mt-5 rounded-xl border border-white/8 bg-black/18 p-3">
              <div className="flex gap-2 text-xs leading-5 text-white/48">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#c9a961]" />
                <span>Minimum 12 characters with uppercase, lowercase, number, symbol, and no known data-breach match.</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className={`${adminButtonClass} mt-5 w-full`}
            >
              {changingPassword ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
              Update password
            </button>
          </form>
        </div>
      </div>
    </AdminPageShell>
  );
}

const inputCls = adminInputClass;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={`${adminPanelClass} p-5`}>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a961]/78">
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

function PasswordField({
  label,
  value,
  show,
  onChange,
  autoComplete = "current-password",
}: {
  label: string;
  value: string;
  show: boolean;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <Field label={label}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={inputCls}
      />
    </Field>
  );
}

async function getSha1Parts(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-1", data);
  const hash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return {
    prefix: hash.slice(0, 5),
    suffix: hash.slice(5),
  };
}
