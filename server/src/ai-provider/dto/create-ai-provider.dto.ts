import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AiProviderName } from '../enums/ai-provider-name.enum';

export class CreateAiProviderDto {
  @ApiProperty({
    enum: AiProviderName,
    description: 'The AI provider name',
    example: AiProviderName.OLLAMA_LOCAL,
  })
  @IsEnum(AiProviderName)
  @IsNotEmpty()
  aiProviderName: AiProviderName;

  @ApiProperty({
    description: 'The model name',
    example: 'llama3.2',
  })
  @IsString()
  @IsNotEmpty()
  modelName: string;

  @ApiPropertyOptional({
    description:
      'API key - required for Gemini. Not needed for Ollama (local/cloud) and will be ignored if provided.',
    example: 'your-api-key-here',
  })
  @IsString()
  @IsOptional()
  apiKey?: string;

  @ApiPropertyOptional({
    description:
      'Base URL - required for Ollama Cloud. Defaults to http://localhost:11434 for Ollama Local. Not needed for Gemini.',
    example: 'http://localhost:11434',
  })
  @IsString()
  @IsOptional()
  baseUrl?: string;
}
