"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/context/ModalContext";

export default function GetStartedButton() {
  const { openModal } = useModal();

  return (
    <Button onClick={() => openModal("searchRenter")}>
      Get Started
    </Button>
  );
}
