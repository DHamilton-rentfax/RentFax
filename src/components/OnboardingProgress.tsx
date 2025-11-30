"use client";

interface OnboardingProgressProps {
  step: number;
  totalSteps?: number;
}

export default function OnboardingProgress({ step, totalSteps = 3 }: OnboardingProgressProps) {
  const progress = Math.round((step / totalSteps) * 100);

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Step {step} of {totalSteps}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
