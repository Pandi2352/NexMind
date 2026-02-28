import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RagMessage, RagMessageSchema } from './rag-message.schema.js';
import { generateUuid } from '../../common/utils/generate-uuid.util.js';

export type RagConversationDocument = HydratedDocument<RagConversation>;

@Schema({ timestamps: true })
export class RagConversation {
  @Prop({ type: String, default: generateUuid })
  _id: string;

  @Prop({ default: 'New RAG Chat' })
  title: string;

  @Prop({ default: '' })
  systemPrompt: string;

  @Prop({ type: [RagMessageSchema], default: [] })
  messages: RagMessage[];
}

export const RagConversationSchema = SchemaFactory.createForClass(RagConversation);
