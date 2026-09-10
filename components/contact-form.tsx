"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Status = "idle" | "submitting" | "success" | "error";

const projectTypes = [
  "Residential Interiors",
  "Commercial Interiors",
  "Kitchens & Custom Joinery",
  "Lighting & Architectural Details",
  "Other",
];
const budgetRanges = ["Under ₹5L", "₹5L – ₹10L", "₹10L – ₹20L", "₹20L – ₹40L", "₹40L+", "Not sure yet"];
const timelines = ["Immediately", "Within 1 month", "1–3 months", "3–6 months", "Just exploring"];

const fieldClass =
  "w-full rounded-sm border border-line bg-paper px-4 py-3.5 text-base outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink-faint focus:border-ink focus:ring-2 focus:ring-ink/10";
const labelClass = "label mb-2 block";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-sm border border-line bg-surface p-8 md:p-12"
      >
        <p className="eyebrow mb-3">Enquiry received</p>
        <h3 className="display-sm">Thank you — we&rsquo;ll be in touch shortly.</h3>
        <p className="body-text mt-6 max-w-body">
          A member of the Imagine Walls team will reach out to discuss your project. For anything urgent, message
          us directly on WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-xs uppercase tracking-widest2 text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
        >
          Submit another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-sm border border-line bg-surface p-6 md:p-10">
      <div className="mb-10 border-b border-line pb-8">
        <p className="label mb-2">Project Enquiry</p>
        <p className="body-text max-w-body">
          Share a few details about your space. We&rsquo;ll respond within one business day.
        </p>
      </div>

      <fieldset className="mb-10">
        <legend className="label mb-6">Your details</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>Name *</label>
            <input id="name" name="name" required className={fieldClass} placeholder="Your full name" />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Phone *</label>
            <input id="phone" name="phone" type="tel" required className={fieldClass} placeholder="+91 00000 00000" />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input id="email" name="email" type="email" className={fieldClass} placeholder="you@email.com" />
          </div>
          <div>
            <label htmlFor="location" className={labelClass}>Location *</label>
            <input id="location" name="location" required className={fieldClass} placeholder="Neighbourhood, city" />
          </div>
        </div>
      </fieldset>

      <fieldset className="mb-10">
        <legend className="label mb-6">Project scope</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="projectType" className={labelClass}>Project Type *</label>
            <select id="projectType" name="projectType" required defaultValue="" className={fieldClass}>
              <option value="" disabled>Select a project type</option>
              {projectTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="projectSize" className={labelClass}>Approximate Project Size</label>
            <input id="projectSize" name="projectSize" className={fieldClass} placeholder="e.g. 3BHK, 1800 sq.ft" />
          </div>
          <div>
            <label htmlFor="budgetRange" className={labelClass}>Budget Range</label>
            <select id="budgetRange" name="budgetRange" defaultValue="" className={fieldClass}>
              <option value="" disabled>Select a budget range</option>
              {budgetRanges.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="timeline" className={labelClass}>Preferred Start Timeline</label>
            <select id="timeline" name="timeline" defaultValue="" className={fieldClass}>
              <option value="" disabled>Select a timeline</option>
              {timelines.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="label mb-6">Tell us more</legend>
        <div>
          <label htmlFor="message" className={labelClass}>Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className={`${fieldClass} min-h-[8rem] resize-y`}
            placeholder="Tell us about the space, rooms involved, and what you're hoping for."
          />
        </div>
      </fieldset>

      <AnimatePresence>
        {status === "error" && error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mt-8 rounded-sm border border-line-strong bg-paper px-4 py-3 text-sm"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="border border-ink bg-ink px-8 py-3.5 text-xs uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-transparent hover:text-ink disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Send Enquiry"}
        </button>
        <span className="text-xs text-ink-faint">* Required fields</span>
      </div>
    </form>
  );
}
