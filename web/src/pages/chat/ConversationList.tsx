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
    <div className="flex w-80 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-3">
        <button
          onClick={() => setShowNew(!showNew)}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Chat
        </button>
      </div>

      {showNew && (
        <form onSubmit={handleCreate} className="border-b border-slate-200 p-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Conversation title (optional)"
            className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            autoFocus
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">
              Create
            </button>
            <button type="button" onClick={() => setShowNew(false)} className="flex-1 rounded bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-auto">
        {conversations.map((conv) => (
          <div
            key={conv._id}
            onClick={() => onSelect(conv._id)}
            className={`group flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-slate-50 ${
              activeId === conv._id ? 'bg-blue-50 border-r-2 border-r-blue-600' : ''
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{conv.title}</p>
              <p className="text-xs text-slate-500">{new Date(conv.updatedAt).toLocaleDateString()}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(conv._id); }}
              className="ml-2 hidden rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 group-hover:block"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
