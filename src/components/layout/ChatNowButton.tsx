'use client';

import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export default function ChatNowButton() {
  return (
    <Button 
      variant="outline"
      onClick={() => {
        // In a real app, you'd open a chat widget (e.g., Intercom, Crisp)
        alert('Opening chat...');
      }}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      Chat Now
    </Button>
  );
}
