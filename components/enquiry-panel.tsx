"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEnquiry } from "@/components/enquiry-provider";
import { siteSettings } from "@/lib/data/site";
import { chrome } from "@/lib/chrome";

const ROOM_TYPES = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Office / Commercial",
  "Full Home",
  "Other",
] as const;

const FINISH_OPTIONS = [
  "Matte Laminate",
  "Gloss / Acrylic",
  "Wood Veneer",
  "Wallpaper / Texture",
  "Paint & Panel",
  "Not sure yet",
] as const;

type FormState = {
  name: string;
  phone: string;
  email: string;
  roomType: string;
  location: string;
  wallArea: string;
  finishPreference: string;
  message: string;
  consent: boolean;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  email: "",
  roomType: "",
  location: "",
  wallArea: "",
  finishPreference: "",
  message: "",
  consent: false,
};

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EnquiryPanel() {
  const { isOpen, close } = useEnquiry();
  const [activeTab, setActiveTab] = useState<"form" | "contact">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ phone: false, email: false });
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false);
      setError(null);
      setActiveTab("form");
    }
  }, [isOpen]);

  const validatePhone = (phone: string) => phone.replace(/\D/g, "").length === 10;
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError("Please fill in name, phone, and email.");
      return;
    }
    if (!form.roomType) {
      setError("Please select a room type.");
      return;
    }
    if (!form.consent) {
      setError("Please agree to be contacted regarding your enquiry.");
      return;
    }
    if (!validatePhone(form.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      setTouched((t) => ({ ...t, phone: true }));
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      setTouched((t) => ({ ...t, email: true }));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.replace(/\D/g, ""),
          email: form.email.trim(),
          projectType: form.roomType,
          location: form.location.trim() || siteSettings.location,
          projectSize: form.wallArea.trim(),
          budgetRange: form.finishPreference,
          message: form.message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit. Please try again.");
        return;
      }
      setForm(emptyForm);
      setTouched({ phone: false, email: false });
      setShowSuccess(true);
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 z-[120] flex h-full w-full flex-col overflow-y-auto border-l border-white/10 bg-black shadow-2xl md:w-[60vw] lg:w-[50vw]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-panel-title"
          >
            <div className="flex items-start justify-between p-8 md:p-12">
              <h2
                id="enquiry-panel-title"
                className="max-w-[16ch] text-4xl font-light leading-tight text-white md:text-5xl"
              >
                Let&apos;s Work{" "}
                <span className="font-display italic" style={{ color: chrome.cream }}>
                  Together!
                </span>
              </h2>
              <button
                type="button"
                onClick={close}
                className="relative z-10 -mr-2 -mt-2 p-2 text-white/60 transition-colors hover:text-white"
                aria-label="Close enquiry panel"
              >
                <IconX className="h-6 w-6" />
              </button>
            </div>

            {!showSuccess && (
              <div className="flex gap-4 border-b border-white/10 px-8 pb-4 md:px-12">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className="border-b-2 pb-2 text-sm font-medium uppercase tracking-wider transition-colors"
                  style={
                    activeTab === "form"
                      ? { borderColor: chrome.cream, color: chrome.cream }
                      : { borderColor: "transparent", color: "rgba(255,255,255,0.4)" }
                  }
                >
                  Enquiry Form
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("contact")}
                  className="border-b-2 pb-2 text-sm font-medium uppercase tracking-wider transition-colors"
                  style={
                    activeTab === "contact"
                      ? { borderColor: chrome.cream, color: chrome.cream }
                      : { borderColor: "transparent", color: "rgba(255,255,255,0.4)" }
                  }
                >
                  Contact
                </button>
              </div>
            )}

            <div className="px-6 pb-8 md:px-8">
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center"
                  >
                    <div
                      className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(245,244,240,0.2)", color: chrome.cream }}
                    >
                      <IconCheck className="h-8 w-8" />
                    </div>
                    <h3 className="text-3xl font-light leading-tight text-white md:text-4xl">
                      Thank you for reaching out
                    </h3>
                    <div className="max-w-md space-y-4">
                      <p className="text-lg leading-relaxed text-white/80">
                        We have received your enquiry and our team is reviewing the details. Someone from Imagine
                        Walls will get in touch shortly.
                      </p>
                      <p className="text-lg leading-relaxed text-white/80">
                        We appreciate your interest and look forward to working with you.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={close}
                      className="mt-4 rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-widest text-white/80 transition-colors hover:border-white hover:text-white"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : activeTab === "form" ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                      <div className="space-y-6">
                        <h3 className="text-lg font-normal text-white">1. Contact Details</h3>
                        <InputGroup
                          placeholder="Name *"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <InputGroup
                              type="tel"
                              placeholder="Phone Number *"
                              value={form.phone}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "");
                                if (value.length > 10) value = value.slice(0, 10);
                                setForm({ ...form, phone: value });
                              }}
                              onBlur={() => setTouched({ ...touched, phone: true })}
                              required
                            />
                            {touched.phone && form.phone && !validatePhone(form.phone) && (
                              <p className="mt-1 px-6 text-xs text-red-400">Please enter a 10-digit mobile number</p>
                            )}
                          </div>
                          <div>
                            <InputGroup
                              type="email"
                              placeholder="Email Address *"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              onBlur={() => setTouched({ ...touched, email: true })}
                              required
                            />
                            {touched.email && form.email && !validateEmail(form.email) && (
                              <p className="mt-1 px-6 text-xs text-red-400">Please enter a valid email address</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-lg font-normal text-white">2. Project Overview</h3>
                        <p className="text-sm text-white/70">Room Type *</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {ROOM_TYPES.map((opt) => (
                            <OptionChip
                              key={opt}
                              label={opt}
                              checked={form.roomType === opt}
                              onSelect={() =>
                                setForm({ ...form, roomType: form.roomType === opt ? "" : opt })
                              }
                            />
                          ))}
                        </div>
                        <InputGroup
                          placeholder="City / Area"
                          value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
                        />
                        <InputGroup
                          placeholder="Approx. wall area (e.g. 120 sq.ft)"
                          value={form.wallArea}
                          onChange={(e) => setForm({ ...form, wallArea: e.target.value })}
                        />
                        <p className="text-sm text-white/70">Finish preference</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {FINISH_OPTIONS.map((opt) => (
                            <OptionChip
                              key={opt}
                              label={opt}
                              checked={form.finishPreference === opt}
                              onSelect={() =>
                                setForm({
                                  ...form,
                                  finishPreference: form.finishPreference === opt ? "" : opt,
                                })
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-lg font-normal text-white">3. Project Notes</h3>
                        <textarea
                          className="h-32 w-full resize-none rounded-3xl border border-white/20 bg-white/5 px-6 py-4 text-base text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-0"
                          style={{ outlineColor: chrome.cream }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = chrome.cream;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "";
                          }}
                          placeholder="Brief description of your space"
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                        />
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-lg font-normal text-white">4. Consent</h3>
                        <label className="group flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={form.consent}
                            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                            className="mt-1 h-5 w-5 rounded border-white/30 bg-white/5 focus:ring-offset-0"
                            style={{ accentColor: chrome.cream }}
                          />
                          <span className="text-sm text-white/90">
                            I agree to be contacted regarding my enquiry.
                          </span>
                        </label>
                        <p className="text-xs leading-relaxed text-white/50">
                          Your details will only be used to respond to this request.
                        </p>
                      </div>

                      {error && (
                        <p role="alert" className="text-sm text-red-400">
                          {error}
                        </p>
                      )}

                      <div className="flex flex-col items-end pt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group flex items-center gap-2 rounded-full px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                          style={{ backgroundColor: chrome.cream, color: chrome.ink }}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                          {!isSubmitting && (
                            <span className="transition-transform group-hover:translate-x-1">↗</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8 pt-4"
                  >
                    <div>
                      <h3 className="mb-1 text-2xl font-light text-white">{siteSettings.email}</h3>
                      <a
                        href={siteSettings.phoneHref}
                        className="text-2xl font-light transition-opacity hover:opacity-80"
                        style={{ color: chrome.cream }}
                      >
                        {siteSettings.phone}
                      </a>
                    </div>
                    <p className="font-light text-white/60">{siteSettings.location}</p>
                    <div className="relative mt-6 h-48 w-full overflow-hidden rounded-xl border border-white/10">
                      <iframe
                        title="Imagine Walls location"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(`${siteSettings.studioName} ${siteSettings.location}`)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale opacity-80 transition-all duration-500 hover:grayscale-0 hover:opacity-100"
                      />
                    </div>
                    <Link
                      href={siteSettings.instagramHref}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs uppercase tracking-widest transition-opacity hover:opacity-80"
                      style={{ color: chrome.cream }}
                    >
                      Instagram ↗
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InputGroup({
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
}: {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "";
        onBlur?.();
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = chrome.cream;
      }}
      required={required}
      className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-4 text-base text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-0"
      style={{ caretColor: chrome.cream }}
      placeholder={placeholder}
    />
  );
}

function OptionChip({
  label,
  checked,
  onSelect,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className="flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all duration-200"
      style={
        checked
          ? { borderColor: chrome.cream, backgroundColor: "rgba(255,255,255,0.1)" }
          : { borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.05)" }
      }
    >
      <input type="checkbox" checked={checked} onChange={onSelect} className="sr-only" aria-hidden />
      <span
        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border transition-colors"
        style={
          checked
            ? { borderColor: chrome.cream, backgroundColor: chrome.cream, color: chrome.ink }
            : { borderColor: "rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.05)" }
        }
      >
        {checked && <IconCheck className="h-4 w-4" />}
      </span>
      <span
        className="text-sm font-medium"
        style={{ color: checked ? "#ffffff" : "rgba(255,255,255,0.8)" }}
      >
        {label}
      </span>
    </label>
  );
}

