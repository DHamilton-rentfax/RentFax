import type { SearchStep } from '../SearchRenterModalMaster';

export default function StepMultiMatch({ setActiveStep }: { setActiveStep: (step: SearchStep) => void }) {
  return (
    <div>
      <h1>Multiple Matches Found</h1>
      <button onClick={() => setActiveStep(1)}>Go Back</button>
    </div>
  );
}
