"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type EnquiryUI = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const EnquiryContext = createContext<EnquiryUI | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <EnquiryContext.Provider value={{ isOpen, open, close }}>{children}</EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used within EnquiryProvider");
  return ctx;
}

