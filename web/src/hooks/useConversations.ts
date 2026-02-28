import { useState, useEffect, useCallback } from 'react';
import type { Conversation, CreateConversationDto } from '../types';
import { chatService } from '../services/chat.service';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatService.getAll();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = useCallback(async (dto: CreateConversationDto) => {
    const conv = await chatService.create(dto);
    await fetchAll();
    setActiveConversation(conv);
  }, [fetchAll]);

  const select = useCallback(async (id: string) => {
    const conv = await chatService.getById(id);
    setActiveConversation(conv);
  }, []);

  const send = useCallback(async (message: string) => {
    if (!activeConversation) return;
    try {
      setSending(true);
      const { conversation } = await chatService.sendMessage(activeConversation._id, { message });
      setActiveConversation(conversation);
      setConversations((prev) =>
        prev.map((c) => (c._id === conversation._id ? { ...c, updatedAt: conversation.updatedAt } : c)),
      );
    } finally {
      setSending(false);
    }
  }, [activeConversation]);

  const remove = useCallback(async (id: string) => {
    await chatService.delete(id);
    if (activeConversation?._id === id) setActiveConversation(null);
    await fetchAll();
  }, [activeConversation, fetchAll]);

  return { conversations, activeConversation, loading, sending, error, create, select, send, remove };
}
