import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VectorStoreController } from './vector-store.controller';
import { VectorStoreService } from './vector-store.service';
import { VectorStore, VectorStoreSchema } from './schemas/vector-store.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: VectorStore.name, schema: VectorStoreSchema },
        ]),
    ],
    controllers: [VectorStoreController],
    providers: [VectorStoreService],
    exports: [VectorStoreService],
})
export class VectorStoreModule { }
