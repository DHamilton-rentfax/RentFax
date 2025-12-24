"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth'; // Assuming useAuth provides user info
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai' | 'agent';
    timestamp: string;
}

// Mock initial messages - in a real app, these would be fetched
const initialMessages: Message[] = [
    {
        id: '1',
        text: 'Hello! I am your AI assistant. How can I help you today?',
        sender: 'ai',
        timestamp: new Date().toISOString(),
    },
    {
        id: '2',
        text: 'I am having trouble with my recent screening report.',
        sender: 'user',
        timestamp: new Date().toISOString(),
    },
    {
        id: '3',
        text: 'I can help with that. Can you please provide the screening ID?',
        sender: 'ai',
        timestamp: new Date().toISOString(),
    },
    {
        id: '4',
        text: 'Sure, it is #12345-ABCDE.',
        sender: 'user',
        timestamp: new Date().toISOString(),
    },
    {
        id: '5',
        text: 'Thank you. I see the report. It seems there is a delay in the county criminal search. This should resolve within 24 hours. Would you like me to notify you?',
        sender: 'ai',
        timestamp: new Date().toISOString(),
    },
    {
        id: '6',
        text: 'Yes please.',
        sender: 'user',
        timestamp: new Date().toISOString(),
    },
];

const MessageBubble = ({ message }: { message: Message }) => {
    const { user } = useAuth(); // To get user's initial for the avatar
    const isUser = message.sender === 'user';
    
    const avatar = isUser ? (
        <Avatar className="w-8 h-8">
            <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
    ) : (
        <Avatar className="w-8 h-8 bg-blue-500 text-white">
             <AvatarFallback>AI</AvatarFallback>
        </Avatar>
    )

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && avatar}
            <div className={`max-w-md p-3 rounded-lg ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                </p>
            </div>
            {isUser && avatar}
        </div>
    );
};


export default function ChatPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom when new messages are added
        if (scrollAreaRef.current) {
             const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
             if (viewport) viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // --- AI Response Simulation ---
        // In a real app, this would be an API call to your chat backend
        // e.g., POST /api/chat { conversationId, message: input }
        try {
            // 1. Send user message to your backend & get AI response.
            // const response = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message: input }) });
            // const aiData = await response.json();
            
            // 2. Simulate a delay for a more realistic feel.
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 3. Create the AI message object.
            const aiMessage: Message = {
                id: Date.now().toString() + '-ai',
                // text: aiData.reply,  // Use actual reply from API
                text: `I understand you said "${input}". I am still in development, but a human agent will be with you shortly. `,
                sender: 'ai',
                timestamp: new Date().toISOString(),
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Failed to get AI response:", error);
            const errorMessage: Message = {
                 id: Date.now().toString() + '-err',
                 text: 'Sorry, I encountered an error. Please try again.',
                 sender: 'ai',
                 timestamp: new Date().toISOString(),
            }
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container mx-auto h-[calc(100vh-80px)] flex justify-center items-center p-4">
            <Card className="w-full max-w-3xl h-full flex flex-col shadow-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Support Chat</h2>
                        <p className="text-sm text-gray-500">Connected with AI Assistant</p>
                    </div>
                    <Button variant="outline">Request Human Agent</Button>
                </div>

                <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                    <div className="space-y-6">
                        {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                        {isLoading && (
                            <div className="flex items-start gap-3">
                                 <Avatar className="w-8 h-8 bg-blue-500 text-white"><AvatarFallback>AI</AvatarFallback></Avatar>
                                 <div className="max-w-md p-3 rounded-lg bg-gray-100">
                                     <p className="text-sm text-gray-500 animate-pulse">AI is typing...</p>
                                 </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type your message here..."
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                            Send
                        </Button>
                    </form>
                </div>
            </Card>
        </main>
    );
}
