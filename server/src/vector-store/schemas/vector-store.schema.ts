import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generateUuid } from '../../common/utils/generate-uuid.util';
import { VectorStoreType } from '../enums/vector-store-type.enum';

export type VectorStoreDocument = VectorStore & Document;

@Schema({ timestamps: true })
export class VectorStore {
    @Prop({ type: String, default: generateUuid })
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: VectorStoreType })
    type: VectorStoreType;

    @Prop({ required: false })
    baseUrl?: string;

    @Prop({ required: false })
    apiKey?: string;

    @Prop({ required: false })
    indexName?: string;
}

export const VectorStoreSchema = SchemaFactory.createForClass(VectorStore);
