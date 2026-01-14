'use client';

import { useModal } from '@/contexts/ModalContext';
import SearchRenterModal from '@/components/search/SearchRenterModal/SearchRenterModal';

export default function GlobalModals() {
  const { modal, close } = useModal();

  // Auth can be wired later — modal must NOT depend on auth
  const user = null;

  if (!modal) return null;

  if (modal !== 'searchRenter') return null;

  return (
    <SearchRenterModal
      open
      onClose={close}
      user={user}
    />
  );
}
