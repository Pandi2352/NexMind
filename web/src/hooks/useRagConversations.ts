import { useState, useEffect, useCallback } from 'react';
import type { Conversation, CreateConversationDto } from '../types';
import { ragChatService } from '../services/rag-chat.service';

export function useRagConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ragChatService.getAll();
            setConversations(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const create = useCallback(async (dto: CreateConversationDto) => {
        try {
            const conv = await ragChatService.create(dto);
            await fetchAll();
            setActiveConversation(conv);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create conversation');
        }
    }, [fetchAll]);

    const select = useCallback(async (id: string) => {
        try {
            const conv = await ragChatService.getById(id);
            setActiveConversation(conv);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to select conversation');
        }
    }, []);

    const send = useCallback(async (content: string) => {
        if (!activeConversation) return;
        try {
            setSending(true);
            setError(null);
            const { conversation } = await ragChatService.sendMessage(activeConversation._id, { message: content });
            setActiveConversation(conversation);
            setConversations((prev) =>
                prev.map((c) => (c._id === conversation._id ? { ...c, updatedAt: conversation.updatedAt } : c)),
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
        } finally {
            setSending(false);
        }
    }, [activeConversation]);

    const remove = useCallback(async (id: string) => {
        try {
            await ragChatService.delete(id);
            if (activeConversation?._id === id) setActiveConversation(null);
            await fetchAll();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete conversation');
        }
    }, [activeConversation, fetchAll]);

    return { conversations, activeConversation, loading, sending, error, create, select, send, remove };
}
