import type { SearchStep } from '../SearchRenterModalMaster';

export default function StepMatchFound({ setActiveStep }: { setActiveStep: (step: SearchStep) => void }) {
  return (
    <div>
      <h1>Match Found</h1>
      <button onClick={() => setActiveStep("auth")}>Authenticate</button>
      <button onClick={() => setActiveStep(1)}>Go Back</button>
    </div>
  );
}
