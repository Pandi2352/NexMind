import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AgentConfig, AgentConfigDocument } from './schemas/agent-config.schema';
import { AgentType } from './enums/agent-type.enum';
import { AssignProviderDto } from './dto/assign-provider.dto';
import { AiProviderService } from '../ai-provider/ai-provider.service';
import { AiProviderDocument } from '../ai-provider/schemas/ai-provider.schema';
import { VectorStoreService } from '../vector-store/vector-store.service';
import { VectorStoreDocument } from '../vector-store/schemas/vector-store.schema';
@Injectable()
export class AgentConfigService {
  constructor(
    @InjectModel(AgentConfig.name)
    private agentConfigModel: Model<AgentConfigDocument>,
    private readonly aiProviderService: AiProviderService,
    private readonly vectorStoreService: VectorStoreService,
  ) { }

  async assignProvider(dto: AssignProviderDto): Promise<AgentConfigDocument> {
    // Validate that the provider exists
    await this.aiProviderService.findOne(dto.aiProviderId);

    // Validate vector store if provided
    if (dto.vectorStoreId) {
      await this.vectorStoreService.findOne(dto.vectorStoreId);
    }

    return this.agentConfigModel.findOneAndUpdate(
      { agentType: dto.agentType },
      {
        agentType: dto.agentType,
        aiProviderId: dto.aiProviderId,
        vectorStoreId: dto.vectorStoreId || null
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
  }

  async findAll(): Promise<AgentConfigDocument[]> {
    return this.agentConfigModel.find().exec();
  }

  async getProviderForAgent(agentType: AgentType): Promise<AiProviderDocument> {
    const config = await this.agentConfigModel.findOne({ agentType }).exec();

    if (config) {
      return this.aiProviderService.findOne(config.aiProviderId);
    }

    // Fallback to global active provider
    return this.aiProviderService.getActive();
  }

  async getVectorStoreForAgent(agentType: AgentType): Promise<VectorStoreDocument | null> {
    const config = await this.agentConfigModel.findOne({ agentType }).exec();
    if (config && config.vectorStoreId) {
      return this.vectorStoreService.findOne(config.vectorStoreId) as unknown as VectorStoreDocument;
    }
    return null;
  }

  async removeAssignment(agentType: AgentType): Promise<AgentConfigDocument> {
    const config = await this.agentConfigModel.findOneAndDelete({ agentType });
    if (!config) {
      throw new NotFoundException(
        `No provider assignment found for agent type: ${agentType}`,
      );
    }
    return config;
  }
}
