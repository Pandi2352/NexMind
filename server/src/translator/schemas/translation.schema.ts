import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { generateUuid } from '../../common/utils/generate-uuid.util.js';

export type TranslationDocument = HydratedDocument<Translation>;

@Schema({ timestamps: true })
export class Translation {
  @Prop({ type: String, default: generateUuid })
  _id: string;

  @Prop({ required: true })
  sourceText: string;

  @Prop({ required: true })
  targetLanguage: string;

  @Prop({ default: 'auto' })
  sourceLanguage: string;

  @Prop({ required: true })
  translatedText: string;
}

export const TranslationSchema = SchemaFactory.createForClass(Translation);
