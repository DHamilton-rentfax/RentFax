'use client';

import { useEffect, useMemo, useState } from "react";

// A mock fetch function to simulate saving progress.
// In a real app, this would be a call to a server action or API endpoint.
async function saveProgress(tourSlug: string, status: string, idx: number) {
    console.log("Saving progress...", { tourSlug, status, idx });
    try {
        await fetch("/api/tours/progress", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tourSlug: tourSlug,
                status,
                currentStepIndex: idx,
            }),
        });
    } catch (error) {
        console.error("Failed to save tour progress:", error);
    }
}

export default function TourRunner({ tour, onClose }: { tour: any, onClose: () => void }) {
  const [stepIndex, setStepIndex] = useState(tour.startAtStep || 0);

  // When the tour changes (e.g., from a different trigger), reset the step index.
  useEffect(() => {
    setStepIndex(tour.startAtStep || 0);
  }, [tour.slug]);

  const step = tour.steps[stepIndex];

  const targetEl = useMemo(() => {
    if (typeof window === 'undefined' || !step?.targetSelector) return null;
    try {
        return document.querySelector(step.targetSelector);
    } catch (e) {
        console.warn(`Tour target element not found: ${step.targetSelector}`);
        return null;
    }
  }, [step]);

  useEffect(() => {
    if (!targetEl) return;
    // Add a class to highlight the target element
    targetEl.classList.add('tour-highlight');
    targetEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

    return () => {
        targetEl.classList.remove('tour-highlight');
    };
  }, [targetEl]);

  const next = async () => {
    const nextIdx = stepIndex + 1;
    if (nextIdx >= tour.steps.length) {
      await saveProgress(tour.slug, "completed", nextIdx);
      onClose();
      return;
    }
    setStepIndex(nextIdx);
    await saveProgress(tour.slug, "in_progress", nextIdx);
  }

  const back = async () => {
    const prevIdx = Math.max(0, stepIndex - 1);
    setStepIndex(prevIdx);
    await saveProgress(tour.slug, "in_progress", prevIdx);
  }

  const skip = async () => {
    await saveProgress(tour.slug, "dismissed", stepIndex);
    onClose();
  }

  if (!step) return null;

  // This is a simplified positioning. A real library would use Popper.js or similar.
  const positionStyle = targetEl ? { 
      position: 'absolute', 
      top: targetEl.getBoundingClientRect().bottom + 10, 
      left: targetEl.getBoundingClientRect().left 
    } : { 
      position: 'fixed', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)'
    };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm" onClick={skip} />
      
      {/* Tooltip box */}
      <div 
        className="z-[1001] w-80 bg-white rounded-lg p-4 shadow-2xl transition-all duration-300"
        style={positionStyle}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the tour
       >
        <div className="font-bold text-lg mb-2">{step.title}</div>
        <div className="text-sm text-gray-800">{step.body}</div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-500">
            Step {stepIndex + 1} of {tour.steps.length}
          </span>
          <div className="flex gap-2">
            <button className="text-sm px-3 py-1.5 border rounded-md hover:bg-gray-100" onClick={back} disabled={stepIndex === 0}>
              Back
            </button>
            <button className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={next}>
              {stepIndex === tour.steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>

         <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={skip}>&times;</button>
      </div>
    </>
  );
}
