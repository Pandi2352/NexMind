import { useState, useRef, useEffect } from 'react';
import type { Conversation } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';
import { MessageBubble } from './MessageBubble';

interface ChatAreaProps {
  conversation: Conversation | null;
  sending: boolean;
  onSend: (message: string) => Promise<void>;
}

export function ChatArea({ conversation, sending, onSend }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState title="No conversation selected" description="Select or create a conversation to start chatting" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const msg = input;
    setInput('');
    await onSend(msg);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <h3 className="font-semibold text-slate-900">{conversation.title}</h3>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
