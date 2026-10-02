"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useEnquiry } from "@/components/enquiry-provider";

type Props = {
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick">;

export function EnquiryButton({ className, children, ...rest }: Props) {
  const { open } = useEnquiry();
  return (
    <button type="button" onClick={open} className={className} style={{ fontFamily: "inherit", cursor: "pointer" }} {...rest}>
      {children}
    </button>
  );
}
