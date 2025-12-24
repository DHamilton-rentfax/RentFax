import type { SearchStep } from '../SearchRenterModalMaster';

export default function StepRiskAndUnlock({ setActiveStep }: { setActiveStep: (step: SearchStep) => void }) {
  return (
    <div>
      <h1>Risk and Unlock</h1>
      <button onClick={() => setActiveStep("auth")}>Authenticate</button>
      <button onClick={() => setActiveStep(1)}>Go Back</button>
    </div>
  );
}
