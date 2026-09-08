"use client";

import { motion } from "framer-motion";
import { useEnquiry } from "@/components/enquiry-provider";
import { chrome } from "@/lib/chrome";

function IconArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17L17 7M17 7H9M17 7v8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FixedInquiryButton() {
  const { open, isOpen } = useEnquiry();
  if (isOpen) return null;

  return (
    <motion.button
      type="button"
      data-site-chrome
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      onClick={open}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-xs font-medium uppercase tracking-widest shadow-lg transition-opacity duration-300 hover:opacity-90 md:hidden"
      style={{ backgroundColor: chrome.cream, color: chrome.ink }}
    >
      Start a Project
      <IconArrowUpRight className="h-4 w-4" />
    </motion.button>
  );
}
