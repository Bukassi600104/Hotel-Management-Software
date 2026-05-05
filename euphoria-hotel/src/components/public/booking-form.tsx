"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Room } from "@/types";

const schema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email("Please enter a valid email"),
  phone: z
    .string()
    .min(7, "Please enter a phone number")
    .regex(/^[+\d\s-]+$/, "Digits, spaces, + and - only"),
  arrivalTime: z.string().optional(),
  notes: z.string().optional(),
  agreed: z.literal(true, { message: "Please accept the terms to continue" }),
});

type FormValues = z.infer<typeof schema>;

interface BookingFormProps {
  room: Room;
  checkin: string;
  checkout: string;
  nights: number;
  adults: number;
  children: number;
  total: number;
}

export function BookingForm({
  room,
  checkin,
  checkout,
  nights,
  adults,
  children,
  total,
}: BookingFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      arrivalTime: "",
      notes: "",
      agreed: false as unknown as true,
    },
  });
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomSlug: room.slug,
          checkin,
          checkout,
          numAdults: adults,
          numChildren: children,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          arrivalTime: values.arrivalTime || undefined,
          notes: values.notes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // Redirect to Paystack — this leaves the page so we don't reset state
      window.location.href = data.paymentUrl;
    } catch {
      toast.error("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border border-[#e8dfd1] bg-[#fffdf8] p-6 shadow-[0_30px_80px_-50px_rgba(23,24,26,0.42)] sm:p-8"
      >
        <h2 className="font-heading text-2xl tracking-tight sm:text-3xl">
          Guest details
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Used for your confirmation, the room key, and pre-arrival messaging.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="Adaeze" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Madu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  We send your booking confirmation here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+234 ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="arrivalTime"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Approximate arrival (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 6pm, flying in from Abuja" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Special requests (optional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Quiet floor, late check-out, dietary preferences..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreed"
          render={({ field }) => (
            <FormItem className="mt-6">
              <label className="flex cursor-pointer items-start gap-3 border border-[#e8dfd1] bg-background/60 p-4 text-sm transition-colors hover:border-[var(--color-gold)]/40">
                <input
                  type="checkbox"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="mt-0.5 size-4 accent-[var(--color-gold)]"
                />
                <span className="text-muted-foreground">
                  I agree to the booking terms. Full payment is taken at
                  reservation, with free cancellation up to 48 hours before
                  check-in.
                </span>
              </label>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden booking summary for screen readers */}
        <p className="sr-only">
          Booking {room.name} for {nights} night{nights !== 1 ? "s" : ""}.
          Check-in {checkin}, check-out {checkout}.
          {adults} adult{adults !== 1 ? "s" : ""}
          {children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : ""}.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="mt-7 inline-flex h-13 min-h-12 w-full items-center justify-center gap-2 gold-gradient px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-[0_12px_30px_-10px_rgba(201,169,97,0.6)] transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Securing room...
            </>
          ) : (
            <>
              Continue to payment
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>
    </Form>
  );
}
