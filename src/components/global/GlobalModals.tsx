"use client";

import { useModal } from "@/contexts/ModalContext";
import SearchRenterModal from "@/components/search/SearchRenterModal";

export default function GlobalModals() {
  const { activeModal, closeModal } = useModal();

  // For now we don't pass a logged-in user; you can wire useAuth() later.
  const user = null;

  return (
    <>
      <SearchRenterModal
        open={activeModal === "searchRenter"}
        onClose={closeModal}
        user={user}
      />
    </>
  );
}
