import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendRagMessageDto {
  @ApiProperty({ description: 'The message content from the user' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
