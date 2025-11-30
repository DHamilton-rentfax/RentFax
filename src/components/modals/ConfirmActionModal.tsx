"use client";

import { Button } from "@/components/ui/button";

export default function ConfirmActionModal({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  close,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-gray-600 text-sm">{message}</p>

      <div className="flex gap-3 pt-3">
        <Button variant="outline" className="flex-1" onClick={close}>
          {cancelText}
        </Button>
        <Button className="flex-1" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </div>
  );
}
