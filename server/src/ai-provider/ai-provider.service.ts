import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiProvider, AiProviderDocument } from './schemas/ai-provider.schema';
import { CreateAiProviderDto } from './dto/create-ai-provider.dto';
import { UpdateAiProviderDto } from './dto/update-ai-provider.dto';
import { AiProviderName } from './enums/ai-provider-name.enum';

@Injectable()
export class AiProviderService {
  constructor(
    @InjectModel(AiProvider.name)
    private aiProviderModel: Model<AiProviderDocument>,
  ) {}

  private validateAndNormalize(dto: CreateAiProviderDto | UpdateAiProviderDto) {
    const providerName = dto.aiProviderName;

    switch (providerName) {
      case AiProviderName.OLLAMA_LOCAL:
        // Ollama local only needs modelName + optional baseUrl, no API key
        dto.apiKey = undefined;
        if (!dto.baseUrl) {
          dto.baseUrl = 'http://localhost:11434';
        }
        break;

      case AiProviderName.OLLAMA_CLOUD:
        // Ollama cloud needs modelName + baseUrl, no API key
        dto.apiKey = undefined;
        if (!dto.baseUrl) {
          throw new BadRequestException(
            'Base URL is required for Ollama Cloud provider',
          );
        }
        break;

      case AiProviderName.GEMINI:
        // Gemini needs modelName + apiKey
        if (!dto.apiKey) {
          throw new BadRequestException(
            'API key is required for Gemini provider',
          );
        }
        break;
    }
  }

  async create(
    createAiProviderDto: CreateAiProviderDto,
  ): Promise<AiProviderDocument> {
    this.validateAndNormalize(createAiProviderDto);

    // Prevent duplicate provider + model combinations
    const existing = await this.aiProviderModel
      .findOne({
        aiProviderName: createAiProviderDto.aiProviderName,
        modelName: createAiProviderDto.modelName,
      })
      .exec();
    if (existing) {
      throw new ConflictException(
        `Provider "${createAiProviderDto.aiProviderName}" with model "${createAiProviderDto.modelName}" already exists`,
      );
    }

    const createdProvider = new this.aiProviderModel(createAiProviderDto);
    return createdProvider.save();
  }

  async findAll(): Promise<AiProviderDocument[]> {
    return this.aiProviderModel.find().exec();
  }

  async findOne(id: string): Promise<AiProviderDocument> {
    const provider = await this.aiProviderModel.findById(id).exec();
    if (!provider) {
      throw new NotFoundException(`AI Provider with ID "${id}" not found`);
    }
    return provider;
  }

  async update(
    id: string,
    updateAiProviderDto: UpdateAiProviderDto,
  ): Promise<AiProviderDocument> {
    // If provider name is being changed, validate with new name; otherwise fetch existing to validate
    if (updateAiProviderDto.aiProviderName) {
      this.validateAndNormalize(updateAiProviderDto);
    }
    const updatedProvider = await this.aiProviderModel
      .findByIdAndUpdate(id, updateAiProviderDto, { returnDocument: 'after' })
      .exec();
    if (!updatedProvider) {
      throw new NotFoundException(`AI Provider with ID "${id}" not found`);
    }
    return updatedProvider;
  }

  async remove(id: string): Promise<AiProviderDocument> {
    const deletedProvider = await this.aiProviderModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedProvider) {
      throw new NotFoundException(`AI Provider with ID "${id}" not found`);
    }
    return deletedProvider;
  }

  async setActive(id: string): Promise<AiProviderDocument> {
    const provider = await this.aiProviderModel.findById(id).exec();
    if (!provider) {
      throw new NotFoundException(`AI Provider with ID "${id}" not found`);
    }
    await this.aiProviderModel.updateMany({}, { isActive: false }).exec();
    provider.isActive = true;
    return provider.save();
  }

  async getActive(): Promise<AiProviderDocument> {
    const provider = await this.aiProviderModel
      .findOne({ isActive: true })
      .exec();
    if (!provider) {
      throw new NotFoundException('No active AI provider configured');
    }
    return provider;
  }
}
