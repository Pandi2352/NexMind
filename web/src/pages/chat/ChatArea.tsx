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
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <EmptyState title="No conversation active" description="Select or create a conversation to start." />
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
    <div className="flex flex-1 flex-col bg-white">
      <div className="border-b-2 border-slate-900 bg-slate-900 px-6 py-4 flex flex-col items-center shadow-sm z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Active Thread</span>
        <h3 className="text-xl font-extrabold uppercase tracking-tight text-white">{conversation.title}</h3>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6 bg-slate-50 pattern-grid-slate-100">
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="border-2 border-slate-900 bg-white px-5 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex gap-2">
                <span className="h-3 w-3 animate-pulse bg-slate-900" />
                <span className="h-3 w-3 animate-pulse bg-slate-900 [animation-delay:0.15s]" />
                <span className="h-3 w-3 animate-pulse bg-slate-900 [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      <form onSubmit={handleSubmit} className="border-t-2 border-slate-900 bg-white p-6">
        <div className="flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="TYPE MESSAGE..."
            disabled={sending}
            className="flex-1 border-2 border-slate-900 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="border-2 border-slate-900 bg-slate-900 px-10 py-4 text-sm font-extrabold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:hover:text-white"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
