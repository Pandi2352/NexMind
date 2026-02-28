import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { generateUuid } from '../../common/utils/generate-uuid.util.js';

export type SummaryDocument = HydratedDocument<Summary>;

@Schema({ timestamps: true })
export class Summary {
  @Prop({ type: String, default: generateUuid })
  _id: string;

  @Prop({ required: true })
  sourceText: string;

  @Prop({ default: 'concise' })
  style: string;

  @Prop({ required: true })
  summaryText: string;
}

export const SummarySchema = SchemaFactory.createForClass(Summary);
