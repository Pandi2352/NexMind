import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AgentType } from '../enums/agent-type.enum';

export class AssignProviderDto {
  @ApiProperty({ enum: AgentType, description: 'The agent type to assign a provider to' })
  @IsEnum(AgentType)
  @IsNotEmpty()
  agentType: AgentType;

  @ApiProperty({ description: 'The AI provider ID to assign' })
  @IsString()
  @IsNotEmpty()
  aiProviderId: string;
}
