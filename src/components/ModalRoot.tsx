'use client';

import { useModal } from '@/contexts/ModalContext';
import SearchRenterModal from '@/components/search/SearchRenterModal';

export default function ModalRoot() {
  const { activeModal, closeModal, modalData } = useModal();

  return (
    <>
      {activeModal === 'searchRenter' && (
        <SearchRenterModal
          open
          onClose={closeModal}
          user={modalData?.user ?? null}
        />
      )}
    </>
  );
}
