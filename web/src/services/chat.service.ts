import type { Conversation, CreateConversationDto, SendMessageDto, SendMessageResponse } from '../types';
import api from './api';

export const chatService = {
  getAll(): Promise<Conversation[]> {
    return api.get('/chat/conversations').then((r) => r.data);
  },

  getById(id: string): Promise<Conversation> {
    return api.get(`/chat/conversations/${id}`).then((r) => r.data);
  },

  create(dto: CreateConversationDto): Promise<Conversation> {
    return api.post('/chat/conversations', dto).then((r) => r.data);
  },

  sendMessage(conversationId: string, dto: SendMessageDto): Promise<SendMessageResponse> {
    return api.post(`/chat/conversations/${conversationId}/messages`, dto).then((r) => r.data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/chat/conversations/${id}`).then(() => undefined);
  },
};
