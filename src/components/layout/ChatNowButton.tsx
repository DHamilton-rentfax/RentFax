'use client';

// In a real app, this status would likely come from a global state, context, or a WebSocket connection.
// For this example, we'll hardcode the status to 'online'.
const chatStatus: 'online' | 'offline' = 'online';

export default function ChatNowButton() {
  const isOnline = chatStatus === 'online';

  return (
    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
      <span className="relative flex h-2.5 w-2.5">
        {isOnline && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
      </span>
      <span>Chat Now</span>
    </button>
  );
}
