import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import {
  PromptOptimization,
  PromptOptimizationDocument,
} from './schemas/prompt-optimization.schema.js';
import { CreatePromptOptimizationDto } from './dto/create-prompt-optimization.dto.js';
import { LangchainService } from '../langchain/langchain.service.js';
import { AgentType } from '../agent-config/enums/agent-type.enum.js';

@Injectable()
export class PromptOptimizerService {
  constructor(
    @InjectModel(PromptOptimization.name)
    private promptOptimizationModel: Model<PromptOptimizationDocument>,
    private readonly langchainService: LangchainService,
  ) {}

  async optimize(
    dto: CreatePromptOptimizationDto,
  ): Promise<PromptOptimizationDocument> {
    const chatModel =
      await this.langchainService.createChatModelForAgent(
        AgentType.PROMPT_OPTIMIZER,
      );

    const purposeInfo = dto.purpose ? ` The intended purpose is: ${dto.purpose}.` : '';

    const systemPrompt = `You are an expert prompt engineer. Your job is to take a user's original prompt and rewrite it into a clearer, more effective version that will produce better results from an AI model.${purposeInfo}

Rules:
- Make the prompt specific, structured, and unambiguous
- Add relevant context, constraints, and output format instructions where helpful
- Preserve the user's original intent
- Only return the optimized prompt, nothing else`;

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(dto.originalPrompt),
    ];

    const response = await chatModel.invoke(messages);

    const optimizedPrompt =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    const optimization = new this.promptOptimizationModel({
      originalPrompt: dto.originalPrompt,
      purpose: dto.purpose || '',
      optimizedPrompt,
    });

    return optimization.save();
  }

  async findAll(): Promise<PromptOptimizationDocument[]> {
    return this.promptOptimizationModel.find().exec();
  }

  async findOne(id: string): Promise<PromptOptimizationDocument> {
    const optimization = await this.promptOptimizationModel
      .findById(id)
      .exec();
    if (!optimization) {
      throw new NotFoundException(
        `Prompt optimization with ID "${id}" not found`,
      );
    }
    return optimization;
  }

  async remove(id: string): Promise<PromptOptimizationDocument> {
    const optimization = await this.promptOptimizationModel
      .findByIdAndDelete(id)
      .exec();
    if (!optimization) {
      throw new NotFoundException(
        `Prompt optimization with ID "${id}" not found`,
      );
    }
    return optimization;
  }
}
