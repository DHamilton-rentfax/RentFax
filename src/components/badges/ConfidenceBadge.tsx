import { useFeatureFlags } from '@/hooks/useFeatureFlags';

const ConfidenceBadge = ({ score }: { score: number }) => {
  const { flags, loading } = useFeatureFlags();

  if (loading || !flags?.enableConfidenceScore) {
    return null;
  }

  const getBadgeColor = () => {
    if (score > 80) return 'bg-green-600';
    if (score > 60) return 'bg-yellow-500';
    return 'bg-red-600';
  };

  return (
    <div
      className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${getBadgeColor()}`}
    >
      Confidence: {score}%
    </div>
  );
};

export default ConfidenceBadge;
