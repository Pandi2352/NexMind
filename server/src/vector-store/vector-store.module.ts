import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VectorStoreController } from './vector-store.controller.js';
import { VectorStoreService } from './vector-store.service.js';
import { VectorStore, VectorStoreSchema } from './schemas/vector-store.schema.js';
import { VectorStoreFactory } from './vector-store.factory.js';
import { LangchainModule } from '../langchain/langchain.module.js';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: VectorStore.name, schema: VectorStoreSchema },
        ]),
        forwardRef(() => LangchainModule),
    ],
    controllers: [VectorStoreController],
    providers: [VectorStoreService, VectorStoreFactory],
    exports: [VectorStoreService, VectorStoreFactory],
})
export class VectorStoreModule { }
