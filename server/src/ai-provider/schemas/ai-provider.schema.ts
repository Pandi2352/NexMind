import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AiProviderName } from '../enums/ai-provider-name.enum';
import { generateUuid } from '../../common/utils/generate-uuid.util';

export type AiProviderDocument = HydratedDocument<AiProvider>;

@Schema({ timestamps: true })
export class AiProvider {
  @Prop({ type: String, default: generateUuid })
  _id: string;
  @Prop({ required: true, enum: AiProviderName })
  aiProviderName: AiProviderName;

  @Prop({ required: true })
  modelName: string;

  @Prop({ default: '' })
  apiKey: string;

  @Prop({ default: '' })
  baseUrl: string;

  @Prop({ default: false })
  isActive: boolean;
}

export const AiProviderSchema = SchemaFactory.createForClass(AiProvider);
