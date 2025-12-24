type Step = "auth" | "verification" | "report";

const steps: { key: Step; label: string }[] = [
  { key: "auth", label: "Account" },
  { key: "verification", label: "Verification" },
  { key: "report", label: "Report" },
];

export function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              s.key === current ? "bg-black" : "bg-gray-300"
            }`}
          />
          <span
            className={s.key === current ? "text-black font-medium" : ""}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div className="h-px w-6 bg-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}
