import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSummaryDto {
  @ApiProperty({
    description: 'The text to summarize',
    example:
      'Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans.',
  })
  @IsString()
  @IsNotEmpty()
  sourceText: string;

  @ApiPropertyOptional({
    description: 'Desired summary style (e.g. bullet-points, one-paragraph, tldr)',
    example: 'bullet-points',
  })
  @IsString()
  @IsOptional()
  style?: string;
}
