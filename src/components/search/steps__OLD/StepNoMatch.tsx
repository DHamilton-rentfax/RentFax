import type { SearchStep } from '../SearchRenterModalMaster';

export default function StepNoMatch({ setActiveStep }: { setActiveStep: (step: SearchStep) => void }) {
  return (
    <div>
      <h1>No Matches Found</h1>
      <button onClick={() => setActiveStep(1)}>Go Back</button>
    </div>
  );
}
