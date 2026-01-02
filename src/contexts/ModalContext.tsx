'use client';

import { createContext, useContext, useState } from "react";

type ModalType = "searchRenter" | null;

const ModalContext = createContext<{
  modal: ModalType;
  open: (m: ModalType) => void;
  close: () => void;
} | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <ModalContext.Provider
      value={{
        modal,
        open: setModal,
        close: () => setModal(null),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("ModalProvider missing");
  return ctx;
}
