import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import {
  HealthConsultation,
  HealthConsultationDocument,
} from './schemas/health-consultation.schema.js';
import { CreateHealthConsultationDto } from './dto/create-health-consultation.dto.js';
import { LangchainService } from '../langchain/langchain.service.js';
import { AgentType } from '../agent-config/enums/agent-type.enum.js';

@Injectable()
export class HealthService {
  constructor(
    @InjectModel(HealthConsultation.name)
    private healthModel: Model<HealthConsultationDocument>,
    private readonly langchainService: LangchainService,
  ) {}

  async consult(
    dto: CreateHealthConsultationDto,
  ): Promise<HealthConsultationDocument> {
    const chatModel =
      await this.langchainService.createChatModelForAgent(AgentType.HEALTH);

    const systemPrompt = `You are a knowledgeable health advisor AI. When a user shares their symptoms, provide comprehensive health guidance in the following structured format:

## Possible Conditions
List the most likely conditions based on the symptoms.

## Recommended Medications
Suggest common over-the-counter medications that may help. Always mention generic names.

## Foods to Eat
Recommend beneficial foods and drinks for recovery.

## Foods to Avoid
List foods and drinks that could worsen the condition.

## Diet Plan
Provide a simple daily diet plan (breakfast, lunch, dinner, snacks) for recovery.

## Lifestyle Tips
Suggest helpful lifestyle changes or home remedies.

## When to See a Doctor
Clearly state warning signs that require immediate medical attention.

⚠️ IMPORTANT DISCLAIMER: Always end your response with a clear disclaimer that this is AI-generated general health information and NOT a substitute for professional medical advice. The user should consult a qualified healthcare provider for proper diagnosis and treatment.

Be empathetic, thorough, and always prioritize safety.`;

    const userParts: string[] = [`Symptoms: ${dto.symptoms}`];
    if (dto.age) userParts.push(`Age: ${dto.age}`);
    if (dto.gender) userParts.push(`Gender: ${dto.gender}`);
    if (dto.existingConditions)
      userParts.push(`Existing conditions: ${dto.existingConditions}`);

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userParts.join('\n')),
    ];

    const response = await chatModel.invoke(messages);

    const advice =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    const consultation = new this.healthModel({
      symptoms: dto.symptoms,
      age: dto.age,
      gender: dto.gender,
      existingConditions: dto.existingConditions,
      advice,
    });

    return consultation.save();
  }

  async findAll(): Promise<HealthConsultationDocument[]> {
    return this.healthModel.find().exec();
  }

  async findOne(id: string): Promise<HealthConsultationDocument> {
    const consultation = await this.healthModel.findById(id).exec();
    if (!consultation) {
      throw new NotFoundException(
        `Health consultation with ID "${id}" not found`,
      );
    }
    return consultation;
  }

  async remove(id: string): Promise<HealthConsultationDocument> {
    const consultation = await this.healthModel
      .findByIdAndDelete(id)
      .exec();
    if (!consultation) {
      throw new NotFoundException(
        `Health consultation with ID "${id}" not found`,
      );
    }
    return consultation;
  }
}
