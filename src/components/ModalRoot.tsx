'use client';

import { useModal } from "@/contexts/ModalContext";
import SearchRenterModal from "@/components/search/SearchRenterModal";
import { useAuth } from "@/hooks/use-auth";

export default function ModalRoot() {
  const { modal, close } = useModal();
  const { user } = useAuth();

  if (modal === "searchRenter") {
    return <SearchRenterModal open={true} onClose={close} user={user} />;
  }

  return null;
}
