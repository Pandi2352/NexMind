export interface PromptOptimization {
  _id: string;
  originalPrompt: string;
  purpose: string;
  optimizedPrompt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromptOptimizationDto {
  originalPrompt: string;
  purpose?: string;
}
