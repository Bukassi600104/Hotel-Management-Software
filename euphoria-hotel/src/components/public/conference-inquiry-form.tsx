"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpRight, Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a phone number"),
  date: z.string().min(1, "Pick a tentative date"),
  guests: z.string().min(1, "Pick a guest range"),
  layout: z.string().min(1, "Pick a preferred layout"),
  message: z.string().min(10, "A few words about the session helps"),
});

type FormValues = z.infer<typeof schema>;

const layouts = ["Boardroom (up to 14)", "U-shape (up to 18)", "Classroom (up to 24)", "Theatre (up to 30)"];
const guestRanges = ["1-10", "11-20", "21-30", "30+"];

export function ConferenceInquiryForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      guests: "",
      layout: "",
      message: "",
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/conference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong");
      }

      form.reset();
      toast.success("Inquiry received", {
        description: `Thanks ${values.name.split(" ")[0]} — our events lead will be in touch within one business day.`,
      });
    } catch (err) {
      toast.error("Couldn't send your inquiry", {
        description: err instanceof Error ? err.message : "Please try again or call us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 border border-[#e8dfd1] bg-[#fffdf8] p-7 shadow-[0_30px_80px_-50px_rgba(23,24,26,0.42)]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Adaeze Madu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tentative date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guests</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {guestRanges.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="layout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred layout</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a layout" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {layouts.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tell us about the session</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="A short note about the agenda, catering preferences, AV needs..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 gold-gradient text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-[0_12px_30px_-10px_rgba(201,169,97,0.6)] transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send inquiry
              <ArrowUpRight className="size-4" />
            </>
          )}
        </button>
      </form>
    </Form>
  );
}
