import SupportAssistant from '@/components/support-assistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import FeatureGate from '@/components/feature-gate';

export default function SupportPage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Bot className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl md:text-4xl">AI Support Assistant</CardTitle>
            <CardDescription className="text-lg pt-2">
              Have a question? Ask our AI assistant for help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FeatureGate name="ai_assistant">
              <SupportAssistant />
            </FeatureGate>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
