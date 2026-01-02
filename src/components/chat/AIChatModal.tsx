'use client';

import { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { askRentfaxAI, ChatContext } from '@/lib/ai/chat'; // Import the new function and type

// NOTE: These are placeholders. In a real app, this data would come from an auth context.
const MOCK_USER_CONTEXT: ChatContext = {
  page: typeof window !== 'undefined' ? window.location.pathname : '',
  role: 'company', // or 'renter', 'admin', 'guest'
  plan: 'pro',       // or 'free', null
};

function AIResponse({ answer }: { answer: string }) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg text-sm text-gray-800">
      <p>{answer}</p>
    </div>
  );
}

function UserQuestion({ question }: { question: string }) {
  return (
    <div className="p-4 bg-blue-100 rounded-lg text-sm text-blue-800 self-end">
      <p>{question}</p>
    </div>
  );
}

export default function AIChatModal() {
  const modal = useModal();
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMessage = question;
    const newConversation = [...conversation, { type: 'user', content: userMessage }];
    setConversation(newConversation);
    setIsLoading(true);
    setQuestion('');

    try {
      // Use the production-ready AI function
      const answer = await askRentfaxAI(userMessage, MOCK_USER_CONTEXT);
      setConversation([...newConversation, { type: 'ai', content: answer }]);
    } catch (error) {
      console.error(error);
      setConversation([...newConversation, { type: 'ai', content: "Sorry — I couldn’t answer that right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto p-6 flex flex-col h-[70vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Ask RentFAX AI</h2>
        <button onClick={() => modal.close()} className="p-1 rounded-full hover:bg-gray-200">
          <X size={20} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4 p-4 border rounded-lg flex flex-col">
        {conversation.map((entry, index) => (
          entry.type === 'user' ? 
            <UserQuestion key={index} question={entry.content} /> : 
            <AIResponse key={index} answer={entry.content} />
        ))}
        {isLoading && <AIResponse answer="Thinking..." />}
      </div>

      <form onSubmit={handleAsk} className="mt-4 flex gap-2">
        <Input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., How do disputes work?"
          className="flex-grow"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !question.trim()}>
          {isLoading ? 'Asking...' : 'Ask'}
        </Button>
      </form>
    </div>
  );
}
