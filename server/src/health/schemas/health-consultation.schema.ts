import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { generateUuid } from '../../common/utils/generate-uuid.util.js';

export type HealthConsultationDocument = HydratedDocument<HealthConsultation>;

@Schema({ timestamps: true })
export class HealthConsultation {
  @Prop({ type: String, default: generateUuid })
  _id: string;

  @Prop({ required: true })
  symptoms: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  existingConditions: string;

  @Prop({ required: true })
  advice: string;
}

export const HealthConsultationSchema =
  SchemaFactory.createForClass(HealthConsultation);
