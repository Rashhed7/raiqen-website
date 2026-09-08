"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface ContactPopupContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const Ctx = createContext<ContactPopupContextValue | null>(null);

export function ContactPopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <Ctx.Provider value={{ isOpen, open, close }}>
      {children}
    </Ctx.Provider>
  );
}

export function useContactPopup(): ContactPopupContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContactPopup must be used within ContactPopupProvider");
  return ctx;
}
