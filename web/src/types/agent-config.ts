export const AgentType = {
  CHAT: 'chat',
  TRANSLATOR: 'translator',
  SUMMARIZER: 'summarizer',
  PROMPT_OPTIMIZER: 'prompt-optimizer',
  HEALTH: 'health',
} as const;

export type AgentTypeValue = (typeof AgentType)[keyof typeof AgentType];

export interface AgentConfig {
  _id: string;
  agentType: AgentTypeValue;
  aiProviderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignProviderDto {
  agentType: AgentTypeValue;
  aiProviderId: string;
}
