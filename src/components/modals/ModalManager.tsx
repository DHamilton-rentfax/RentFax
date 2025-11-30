'use client';

import { useModal } from "@/contexts/ModalContext";
import { modalRegistry } from "./modal.registry";
import { ModalType } from "@/contexts/ModalContext";

const sheetComponents: ModalType[] = ["searchRenter"];

export default function ModalManager() {
  const { isOpen, modalType, modalProps, closeModal } = useModal();

  if (!isOpen || !modalType) return null;

  const ModalOrSheetComponent = modalRegistry[modalType];

  if (!ModalOrSheetComponent) {
    console.error(`Unknown modal type: ${modalType}`);
    return null;
  }

  const isSheet = sheetComponents.includes(modalType);

  const componentToRender = (
    <ModalOrSheetComponent {...modalProps} open={isOpen} onClose={closeModal} />
  );

  if (isSheet) {
    return componentToRender;
  }

  // Fallback to old modal frame for others
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        {componentToRender}
      </div>
    </div>
  );
}
