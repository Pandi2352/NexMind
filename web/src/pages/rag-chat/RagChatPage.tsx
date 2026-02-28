import { useRagConversations } from '../../hooks/useRagConversations';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConversationList } from './ConversationList';
import { RagChatArea } from './RagChatArea';

export function RagChatPage() {
  const { conversations, activeConversation, loading, sending, error, create, select, send, remove } = useRagConversations();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex h-full overflow-hidden">
      {error && (
        <div className="absolute left-0 right-0 top-0 z-10 bg-red-500 px-4 py-2 text-center text-xs font-medium text-white">
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
      <RagChatArea
        conversation={activeConversation}
        sending={sending}
        onSend={send}
      />
    </div>
  );
}
