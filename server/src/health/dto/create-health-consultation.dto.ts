import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateHealthConsultationDto {
  @ApiProperty({
    description: 'The symptoms the user is experiencing',
    example: 'headache, fever, body ache, sore throat',
  })
  @IsString()
  @IsNotEmpty()
  symptoms: string;

  @ApiPropertyOptional({
    description: 'Age of the user',
    example: 30,
  })
  @IsNumber()
  @IsOptional()
  age?: number;

  @ApiPropertyOptional({
    description: 'Gender of the user',
    example: 'male',
  })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({
    description: 'Any existing medical conditions',
    example: 'diabetes, hypertension',
  })
  @IsString()
  @IsOptional()
  existingConditions?: string;
}
