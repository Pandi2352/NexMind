import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiPropertyOptional({
    description: 'Title of the conversation',
    example: 'My Chat',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'System prompt for the conversation',
    example: 'You are a helpful assistant.',
  })
  @IsString()
  @IsOptional()
  systemPrompt?: string;
}
