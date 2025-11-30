"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import { modalRegistry } from "@/components/modals/modal.registry";

export type ModalType = keyof typeof modalRegistry;

interface OpenOptions {
  analyticsEventName?: string;
}

interface ModalContextProps {
  isOpen: boolean;
  modalType: ModalType | null;
  modalProps: any;
  openModal: (type: ModalType, props?: any, options?: OpenOptions) => void;
  closeModal: () => void;
  queueModal: (type: ModalType, props?: any, options?: OpenOptions) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [modalProps, setModalProps] = useState<any>({});
  const [queued, setQueued] = useState<{
    type: ModalType;
    props: any;
    options?: OpenOptions;
  } | null>(null);

  const openModal = useCallback(
    (type: ModalType, props = {}, options: OpenOptions = {}) => {
      setModalType(type);
      setModalProps(props);
      setIsOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalType(null);
    setModalProps({});

    // Handle queue
    if (queued) {
      const next = queued;
      setQueued(null);
      setTimeout(() => {
        openModal(next.type, next.props, next.options);
      }, 50);
    }
  }, [queued, openModal]);

  const queueModal = useCallback(
    (type: ModalType, props = {}, options = {}) => {
      setQueued({ type, props, options });
    },
    []
  );

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        modalType,
        modalProps,
        openModal,
        closeModal,
        queueModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};
