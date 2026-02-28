import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VectorStore, VectorStoreDocument } from './schemas/vector-store.schema';
import { CreateVectorStoreDto } from './dto/create-vector-store.dto';
import { UpdateVectorStoreDto } from './dto/update-vector-store.dto';

@Injectable()
export class VectorStoreService {
    constructor(
        @InjectModel(VectorStore.name)
        private vectorStoreModel: Model<VectorStoreDocument>,
    ) { }

    async create(createVectorStoreDto: CreateVectorStoreDto): Promise<VectorStore> {
        const created = new this.vectorStoreModel(createVectorStoreDto);
        return created.save();
    }

    async findAll(): Promise<VectorStore[]> {
        return this.vectorStoreModel.find().exec();
    }

    async findOne(id: string): Promise<VectorStore> {
        const store = await this.vectorStoreModel.findById(id).exec();
        if (!store) {
            throw new NotFoundException(`VectorStore with ID ${id} not found`);
        }
        return store;
    }

    async update(id: string, updateVectorStoreDto: UpdateVectorStoreDto): Promise<VectorStore> {
        const updated = await this.vectorStoreModel
            .findByIdAndUpdate(id, updateVectorStoreDto, { new: true })
            .exec();
        if (!updated) {
            throw new NotFoundException(`VectorStore with ID ${id} not found`);
        }
        return updated;
    }

    async remove(id: string): Promise<void> {
        const deleted = await this.vectorStoreModel.findByIdAndDelete(id).exec();
        if (!deleted) {
            throw new NotFoundException(`VectorStore with ID ${id} not found`);
        }
    }
}
