import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { generateUuid } from '../../common/utils/generate-uuid.util.js';

export type PromptOptimizationDocument = HydratedDocument<PromptOptimization>;

@Schema({ timestamps: true })
export class PromptOptimization {
  @Prop({ type: String, default: generateUuid })
  _id: string;

  @Prop({ required: true })
  originalPrompt: string;

  @Prop({ default: '' })
  purpose: string;

  @Prop({ required: true })
  optimizedPrompt: string;
}

export const PromptOptimizationSchema =
  SchemaFactory.createForClass(PromptOptimization);
