import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'The message to send to the AI',
    example: 'Hello, how are you?',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
