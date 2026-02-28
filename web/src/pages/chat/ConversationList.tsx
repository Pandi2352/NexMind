import { useState } from 'react';
import type { Conversation, CreateConversationDto } from '../../types';

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: (dto: CreateConversationDto) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ConversationList({ conversations, activeId, onSelect, onCreate, onDelete }: ConversationListProps) {
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate({ title: title || undefined });
    setTitle('');
    setShowNew(false);
  };

  return (
    <div className="flex w-80 flex-col border-r-2 border-slate-900 bg-white">
      <div className="border-b-2 border-slate-900 p-4">
        <button
          onClick={() => setShowNew(!showNew)}
          className="w-full border-2 border-slate-900 bg-slate-900 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-slate-900"
        >
          {showNew ? 'Close' : 'New Chat'}
        </button>
      </div>

      {showNew && (
        <form onSubmit={handleCreate} className="border-b-2 border-slate-900 p-4 bg-slate-50">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="CONVERSATION TITLE"
            className="mb-4 w-full border-2 border-slate-900 bg-white px-3 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 border-2 border-slate-900 bg-slate-900 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-slate-900">
              Create
            </button>
            <button type="button" onClick={() => setShowNew(false)} className="flex-1 border-2 border-slate-900 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-100">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-auto divide-y-2 divide-slate-100">
        <div className="px-4 py-2 border-b-2 border-slate-900 bg-slate-900">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white">History</span>
        </div>
        {conversations.map((conv) => (
          <div
            key={conv._id}
            onClick={() => onSelect(conv._id)}
            className={`group flex cursor-pointer items-center justify-between px-4 py-4 transition-colors hover:bg-slate-100 ${
              activeId === conv._id ? 'bg-slate-100 border-l-4 border-slate-900' : 'border-l-4 border-transparent'
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">{conv.title}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{new Date(conv.updatedAt).toLocaleDateString()}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(conv._id); }}
              className="ml-3 hidden border-2 border-slate-900 p-1 text-slate-900 hover:bg-slate-900 hover:text-white group-hover:block transition-colors"
              title="Delete"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
