"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ModalId = "searchRenter" | string;

interface SearchFormState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  countryCode: string;
  stateCode: string;
  licenseNumber: string;
}

interface ModalContextValue {
  activeModal: ModalId | null;
  modalData: any;

  openModal: (id: ModalId, data?: any) => void;
  closeModal: () => void;

  searchForm: SearchFormState;
  updateSearchForm: (fields: Partial<SearchFormState>) => void;
  resetSearchForm: () => void;
}

const defaultSearchForm: SearchFormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  countryCode: "US",
  stateCode: "",
  licenseNumber: "",
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const [searchForm, setSearchForm] =
    useState<SearchFormState>(defaultSearchForm);

  const openModal = useCallback((id: ModalId, data?: any) => {
    setActiveModal(id);
    setModalData(data ?? null);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  const updateSearchForm = useCallback((fields: Partial<SearchFormState>) => {
    setSearchForm((prev) => ({ ...prev, ...fields }));
  }, []);

  const resetSearchForm = useCallback(() => {
    setSearchForm(defaultSearchForm);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        modalData,
        openModal,
        closeModal,
        searchForm,
        updateSearchForm,
        resetSearchForm,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return ctx;
}
