import { useConversations } from '../../hooks/useConversations';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConversationList } from './ConversationList';
import { ChatArea } from './ChatArea';

export function ChatPage() {
  const { conversations, activeConversation, loading, sending, error, create, select, send, remove } = useConversations();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {error && (
        <div className="absolute left-0 right-0 top-0 z-10 border-b-2 border-red-900 bg-red-50 p-3 text-center text-xs font-bold uppercase tracking-widest text-red-900">
          {error}
        </div>
      )}
      <ConversationList
        conversations={conversations}
        activeId={activeConversation?._id ?? null}
        onSelect={select}
        onCreate={create}
        onDelete={remove}
      />
      <ChatArea
        conversation={activeConversation}
        sending={sending}
        onSend={send}
      />
    </div>
  );
}
