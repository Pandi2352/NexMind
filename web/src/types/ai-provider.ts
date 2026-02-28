export const AiProviderName = {
  OLLAMA_LOCAL: 'ollama local',
  OLLAMA_CLOUD: 'ollama cloud',
  GEMINI: 'gemini',
} as const;

export type AiProviderNameType = (typeof AiProviderName)[keyof typeof AiProviderName];

export interface AiProvider {
  _id: string;
  aiProviderName: AiProviderNameType;
  modelName: string;
  apiKey?: string;
  baseUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAiProviderDto {
  aiProviderName: AiProviderNameType;
  modelName: string;
  apiKey?: string;
  baseUrl?: string;
}

export interface UpdateAiProviderDto {
  aiProviderName?: AiProviderNameType;
  modelName?: string;
  apiKey?: string;
  baseUrl?: string;
}
