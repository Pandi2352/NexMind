import { useConversations } from '../../hooks/useConversations';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConversationList } from './ConversationList';
import { ChatArea } from './ChatArea';

export function ChatPage() {
  const { conversations, activeConversation, loading, sending, error, create, select, send, remove } = useConversations();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex h-full">
      {error && (
        <div className="absolute left-0 right-0 top-0 z-10 bg-red-50 p-2 text-center text-sm text-red-700">{error}</div>
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
