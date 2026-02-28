export const MessageRole = {
  HUMAN: 'human',
  AI: 'ai',
  SYSTEM: 'system',
} as const;

export type MessageRoleType = (typeof MessageRole)[keyof typeof MessageRole];

export interface Message {
  _id: string;
  role: MessageRoleType;
  content: string;
}

export interface Conversation {
  _id: string;
  title: string;
  systemPrompt: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationDto {
  title?: string;
  systemPrompt?: string;
}

export interface SendMessageDto {
  message: string;
}

export interface SendMessageResponse {
  reply: string;
  conversation: Conversation;
}
