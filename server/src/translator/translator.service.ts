import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import {
  Translation,
  TranslationDocument,
} from './schemas/translation.schema.js';
import { CreateTranslationDto } from './dto/create-translation.dto.js';
import { LangchainService } from '../langchain/langchain.service.js';
import { AgentType } from '../agent-config/enums/agent-type.enum.js';

@Injectable()
export class TranslatorService {
  constructor(
    @InjectModel(Translation.name)
    private translationModel: Model<TranslationDocument>,
    private readonly langchainService: LangchainService,
  ) {}

  async translate(dto: CreateTranslationDto): Promise<TranslationDocument> {
    const chatModel = await this.langchainService.createChatModelForAgent(AgentType.TRANSLATOR);

    const sourceLanguageInfo =
      dto.sourceLanguage && dto.sourceLanguage !== 'auto'
        ? ` from ${dto.sourceLanguage}`
        : '';

    const systemPrompt = `You are a professional translator. Translate the following text${sourceLanguageInfo} to ${dto.targetLanguage}. Only return the translated text, nothing else.`;

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(dto.sourceText),
    ];

    const response = await chatModel.invoke(messages);

    const translatedText =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    const translation = new this.translationModel({
      sourceText: dto.sourceText,
      targetLanguage: dto.targetLanguage,
      sourceLanguage: dto.sourceLanguage || 'auto',
      translatedText,
    });

    return translation.save();
  }

  async findAll(): Promise<TranslationDocument[]> {
    return this.translationModel.find().exec();
  }

  async findOne(id: string): Promise<TranslationDocument> {
    const translation = await this.translationModel.findById(id).exec();
    if (!translation) {
      throw new NotFoundException(`Translation with ID "${id}" not found`);
    }
    return translation;
  }

  async remove(id: string): Promise<TranslationDocument> {
    const translation = await this.translationModel
      .findByIdAndDelete(id)
      .exec();
    if (!translation) {
      throw new NotFoundException(`Translation with ID "${id}" not found`);
    }
    return translation;
  }
}
