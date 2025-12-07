import { Sparkles } from "lucide-react";

const AiSummary = ({ summary }: { summary: string }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center">
        <Sparkles className="h-6 w-6 text-purple-600" />
        <h2 className="ml-3 text-lg font-medium text-gray-900">AI Risk Summary</h2>
      </div>
      <div className="mt-4 text-sm text-gray-600 space-y-4">
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default AiSummary;
