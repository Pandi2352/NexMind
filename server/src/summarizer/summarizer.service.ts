import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Summary, SummaryDocument } from './schemas/summary.schema.js';
import { CreateSummaryDto } from './dto/create-summary.dto.js';
import { LangchainService } from '../langchain/langchain.service.js';
import { AgentType } from '../agent-config/enums/agent-type.enum.js';

@Injectable()
export class SummarizerService {
  constructor(
    @InjectModel(Summary.name)
    private summaryModel: Model<SummaryDocument>,
    private readonly langchainService: LangchainService,
  ) {}

  async summarize(dto: CreateSummaryDto): Promise<SummaryDocument> {
    const chatModel =
      await this.langchainService.createChatModelForAgent(
        AgentType.SUMMARIZER,
      );

    const styleInstruction = dto.style
      ? ` Use a "${dto.style}" style.`
      : '';

    const systemPrompt = `You are a professional summarizer. Summarize the following text concisely while retaining the key information.${styleInstruction} Only return the summary, nothing else.`;

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(dto.sourceText),
    ];

    const response = await chatModel.invoke(messages);

    const summaryText =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    const summary = new this.summaryModel({
      sourceText: dto.sourceText,
      style: dto.style || 'concise',
      summaryText,
    });

    return summary.save();
  }

  async findAll(): Promise<SummaryDocument[]> {
    return this.summaryModel.find().exec();
  }

  async findOne(id: string): Promise<SummaryDocument> {
    const summary = await this.summaryModel.findById(id).exec();
    if (!summary) {
      throw new NotFoundException(`Summary with ID "${id}" not found`);
    }
    return summary;
  }

  async remove(id: string): Promise<SummaryDocument> {
    const summary = await this.summaryModel.findByIdAndDelete(id).exec();
    if (!summary) {
      throw new NotFoundException(`Summary with ID "${id}" not found`);
    }
    return summary;
  }
}
