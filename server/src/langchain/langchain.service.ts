import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { AiProviderService } from '../ai-provider/ai-provider.service.js';
import { AiProviderName } from '../ai-provider/enums/ai-provider-name.enum.js';
import { AiProviderDocument } from '../ai-provider/schemas/ai-provider.schema.js';
import { AgentConfigService } from '../agent-config/agent-config.service.js';
import { AgentType } from '../agent-config/enums/agent-type.enum.js';

@Injectable()
export class LangchainService {
  private readonly logger = new Logger(LangchainService.name);

  constructor(
    private readonly aiProviderService: AiProviderService,
    private readonly agentConfigService: AgentConfigService,
  ) { }

  async createChatModel(): Promise<BaseChatModel> {
    const provider = await this.aiProviderService.getActive();
    return this.buildChatModel(provider);
  }

  async createChatModelForAgent(agentType: AgentType): Promise<BaseChatModel> {
    const provider =
      await this.agentConfigService.getProviderForAgent(agentType);
    return this.buildChatModel(provider);
  }

  private async buildChatModel(
    provider: AiProviderDocument,
  ): Promise<BaseChatModel> {
    switch (provider.aiProviderName) {
      case AiProviderName.OLLAMA_LOCAL: {
        const { ChatOllama } = await import('@langchain/ollama');
        return new ChatOllama({
          model: provider.modelName,
          baseUrl: provider.baseUrl || 'http://localhost:11434',
        }) as unknown as BaseChatModel;
      }

      case AiProviderName.OLLAMA_CLOUD: {
        if (!provider.baseUrl) {
          throw new BadRequestException(
            'Base URL is required for Ollama Cloud provider',
          );
        }
        const { ChatOllama } = await import('@langchain/ollama');
        return new ChatOllama({
          model: provider.modelName,
          baseUrl: provider.baseUrl,
        }) as unknown as BaseChatModel;
      }

      case AiProviderName.GEMINI: {
        if (!provider.apiKey) {
          throw new BadRequestException(
            'API key is required for Gemini provider',
          );
        }
        const { ChatGoogleGenerativeAI } = await import(
          '@langchain/google-genai'
        );
        return new ChatGoogleGenerativeAI({
          model: provider.modelName,
          apiKey: provider.apiKey,
        }) as unknown as BaseChatModel;
      }

      default:
        throw new BadRequestException(
          `Unsupported AI provider: ${provider.aiProviderName}`,
        );
    }
  }

  async createEmbeddingsModel(): Promise<any> {
    const provider = await this.aiProviderService.getActive();
    return this.buildEmbeddingsModel(provider);
  }

  async createEmbeddingsModelForAgent(agentType: AgentType): Promise<any> {
    const provider = await this.agentConfigService.getProviderForAgent(agentType);
    return this.buildEmbeddingsModel(provider);
  }

  private async buildEmbeddingsModel(provider: AiProviderDocument): Promise<any> {
    this.logger.log(`Building embeddings model for provider: ${provider.aiProviderName}, model: ${provider.modelName}`);
    switch (provider.aiProviderName) {
      case AiProviderName.OLLAMA_LOCAL: {
        const { OllamaEmbeddings } = await import('@langchain/ollama');
        return new OllamaEmbeddings({
          model: provider.modelName,
          baseUrl: provider.baseUrl || 'http://localhost:11434',
        });
      }

      case AiProviderName.OLLAMA_CLOUD: {
        if (!provider.baseUrl) {
          throw new BadRequestException('Base URL is required for Ollama Cloud provider');
        }
        const { OllamaEmbeddings } = await import('@langchain/ollama');
        return new OllamaEmbeddings({
          model: provider.modelName,
          baseUrl: provider.baseUrl,
        });
      }

      case AiProviderName.GEMINI: {
        if (!provider.apiKey) {
          throw new BadRequestException('API key is required for Gemini provider');
        }
        const { GoogleGenerativeAIEmbeddings } = await import('@langchain/google-genai');
        // Use the newest embedding model for Gemini
        const embeddingModel = 'models/gemini-embedding-001';
        this.logger.log(`Using Gemini Embedding Model: ${embeddingModel}`);
        return new GoogleGenerativeAIEmbeddings({
          model: embeddingModel,
          apiKey: provider.apiKey,
        });
      }

      default:
        throw new BadRequestException(`Unsupported AI provider: ${provider.aiProviderName}`);
    }
  }
}
