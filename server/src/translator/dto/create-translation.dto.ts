import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTranslationDto {
  @ApiProperty({
    description: 'The text to translate',
    example: 'Hello, how are you?',
  })
  @IsString()
  @IsNotEmpty()
  sourceText: string;

  @ApiProperty({
    description: 'The target language for translation',
    example: 'Tamil',
  })
  @IsString()
  @IsNotEmpty()
  targetLanguage: string;

  @ApiPropertyOptional({
    description: 'The source language (defaults to auto-detect)',
    example: 'English',
  })
  @IsString()
  @IsOptional()
  sourceLanguage?: string;
}
