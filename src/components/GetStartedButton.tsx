'use client';

import { useModal } from '@/context/ModalContext';

export default function GetStartedButton() {
  const { openModal } = useModal();

  return (
    <button
      onClick={openModal}
      className="px-8 py-3 bg-[#1A2540] text-white font-semibold rounded-lg hover:bg-[#2C3E66] transition"
    >
      Get Started
    </button>
  );
}
