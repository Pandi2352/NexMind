import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePromptOptimizationDto {
  @ApiProperty({
    description: 'The original prompt to optimize',
    example: 'Write me a story about a dog',
  })
  @IsString()
  @IsNotEmpty()
  originalPrompt: string;

  @ApiPropertyOptional({
    description: 'The intended purpose or goal of the prompt',
    example: 'Creative writing for a children\'s book',
  })
  @IsString()
  @IsOptional()
  purpose?: string;
}
