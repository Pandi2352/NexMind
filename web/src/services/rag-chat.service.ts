import type { Conversation, CreateConversationDto, SendMessageDto, SendMessageResponse } from '../types';
import api from './api';

export const ragChatService = {
    getAll(): Promise<Conversation[]> {
        return api.get('/rag-chat/conversations').then((r) => r.data);
    },

    getById(id: string): Promise<Conversation> {
        return api.get(`/rag-chat/conversations/${id}`).then((r) => r.data);
    },

    create(dto: CreateConversationDto): Promise<Conversation> {
        return api.post('/rag-chat/conversations', dto).then((r) => r.data);
    },

    sendMessage(conversationId: string, dto: SendMessageDto): Promise<SendMessageResponse> {
        return api.post(`/rag-chat/conversations/${conversationId}/messages`, dto).then((r) => r.data);
    },

    delete(id: string): Promise<void> {
        return api.delete(`/rag-chat/conversations/${id}`).then(() => undefined);
    },

    addKnowledge(texts: string[]): Promise<{ inserted: number }> {
        return api.post('/rag-chat/conversations/knowledge', { texts }).then((r) => r.data);
    },
};
