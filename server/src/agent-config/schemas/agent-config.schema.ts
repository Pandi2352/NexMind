import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generateUuid } from '../../common/utils/generate-uuid.util';
import { AgentType } from '../enums/agent-type.enum';

export type AgentConfigDocument = AgentConfig & Document;

@Schema({ timestamps: true })
export class AgentConfig {
  @Prop({ type: String, default: generateUuid })
  _id: string;

  @Prop({ required: true, enum: AgentType, unique: true })
  agentType: AgentType;

  @Prop({ required: true })
  aiProviderId: string;

  @Prop({ required: false })
  vectorStoreId?: string;
}

export const AgentConfigSchema = SchemaFactory.createForClass(AgentConfig);
