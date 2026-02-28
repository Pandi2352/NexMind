import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRagConversationDto {
  @ApiPropertyOptional({ description: 'Optional conversation title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Optional system prompt' })
  @IsString()
  @IsOptional()
  systemPrompt?: string;
}
