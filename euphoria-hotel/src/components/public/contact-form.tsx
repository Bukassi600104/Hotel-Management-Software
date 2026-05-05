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
  phone: z.string().optional(),
  topic: z.string().min(1, "Pick a topic"),
  message: z.string().min(10, "A few more words helps us reply faster"),
});

type FormValues = z.infer<typeof schema>;

const topics = [
  "Reservation enquiry",
  "Existing booking",
  "Conference & events",
  "Restaurant booking",
  "Press & media",
  "General feedback",
];

export function ContactForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "",
      message: "",
    },
  });
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong");
      }

      form.reset();
      toast.success("Message sent", {
        description: `Thanks ${values.name.split(" ")[0]} — our team will reply within one business day.`,
      });
    } catch (err) {
      toast.error("Couldn't send your message", {
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
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-dark)]">
            <span className="block h-px w-10 bg-[var(--color-gold)]" />
            Send a note
          </span>
          <h3 className="mt-2 font-heading text-2xl tracking-tight">
            We usually reply within a working day.
          </h3>
        </div>

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
                  <Input type="email" placeholder="you@example.com" {...field} />
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
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="+234 ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="What is this about?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
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
              <FormLabel>Your message</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Tell us a little about what you need..."
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
              Send message
              <ArrowUpRight className="size-4" />
            </>
          )}
        </button>
      </form>
    </Form>
  );
}
