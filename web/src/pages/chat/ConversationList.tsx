import { useState } from "react";
import type { Conversation, CreateConversationDto } from "../../types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: (dto: CreateConversationDto) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
}: ConversationListProps) {
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate({ title: title || undefined });
    setTitle("");
    setShowNew(false);
  };

  return (
    <div className="flex w-80 flex-col border-r border-slate-200 bg-white">
      <div className="p-4">
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-blue-500/40 hover:brightness-110"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Chat
        </button>
      </div>

      {showNew && (
        <form
          onSubmit={handleCreate}
          className="mx-4 mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Conversation title (optional)"
            className="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="px-4 pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Conversations
        </p>
      </div>

      <div className="flex-1 space-y-1 overflow-auto px-2 pb-4">
        {conversations.map((conv) => (
          <div
            key={conv._id}
            onClick={() => onSelect(conv._id)}
            className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-all ${
              activeId === conv._id
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm ${
                activeId === conv._id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{conv.title}</p>
              <p className="text-xs text-slate-400">
                {new Date(conv.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv._id);
              }}
              className="hidden shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 group-hover:block"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
