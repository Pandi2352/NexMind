import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Message, MessageSchema } from './message.schema.js';
import { generateUuid } from '../../common/utils/generate-uuid.util.js';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: String, default: generateUuid })
  _id: string;
  @Prop({ default: 'New Conversation' })
  title: string;

  @Prop({ default: '' })
  systemPrompt: string;

  @Prop({ type: [MessageSchema], default: [] })
  messages: Message[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
