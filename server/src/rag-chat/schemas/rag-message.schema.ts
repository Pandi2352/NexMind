import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MessageRole } from '../enums/message-role.enum.js';
import { generateUuid } from '../../common/utils/generate-uuid.util.js';

@Schema({ timestamps: true })
export class RagMessage {
  @Prop({ type: String, default: generateUuid })
  _id: string;

  @Prop({ required: true, enum: MessageRole })
  role: MessageRole;

  @Prop({ required: true })
  content: string;
}

export const RagMessageSchema = SchemaFactory.createForClass(RagMessage);
