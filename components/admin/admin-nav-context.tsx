"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useTransition } from "react";

type AdminNavContextValue = {
  isPending: boolean;
  startNavigation: (navigate: () => void) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
};

const AdminNavContext = createContext<AdminNavContextValue>({
  isPending: false,
  startNavigation: (navigate) => navigate(),
  mobileOpen: false,
  setMobileOpen: () => {},
  toggleMobile: () => {},
});

export function useAdminNav() {
  return useContext(AdminNavContext);
}

export function AdminNavProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const startNavigation = useCallback((navigate: () => void) => {
    setMobileOpen(false);
    startTransition(() => {
      navigate();
    });
  }, []);

  const value = useMemo<AdminNavContextValue>(
    () => ({
      isPending,
      startNavigation,
      mobileOpen,
      setMobileOpen,
      toggleMobile: () => setMobileOpen((v) => !v),
    }),
    [isPending, startNavigation, mobileOpen],
  );

  return <AdminNavContext.Provider value={value}>{children}</AdminNavContext.Provider>;
}
