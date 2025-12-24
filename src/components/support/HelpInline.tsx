'use client';

export function HelpInline({ context }: { context: string }) {
  return (
    <button
      className="text-blue-600 underline text-xs"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("openSupportModal", { detail: { context } })
        )
      }
    >
      Help
    </button>
  );
}
