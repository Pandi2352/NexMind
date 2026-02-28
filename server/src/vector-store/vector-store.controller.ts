import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VectorStoreService } from './vector-store.service';
import { CreateVectorStoreDto } from './dto/create-vector-store.dto';
import { UpdateVectorStoreDto } from './dto/update-vector-store.dto';

@ApiTags('vector-store')
@Controller('vector-store')
export class VectorStoreController {
    constructor(private readonly vectorStoreService: VectorStoreService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new vector store configuration' })
    @ApiResponse({ status: 201, description: 'Created successfully.' })
    create(@Body() createVectorStoreDto: CreateVectorStoreDto) {
        return this.vectorStoreService.create(createVectorStoreDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all vector store configurations' })
    findAll() {
        return this.vectorStoreService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a vector store by ID' })
    findOne(@Param('id') id: string) {
        return this.vectorStoreService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a vector store configuration' })
    update(@Param('id') id: string, @Body() updateVectorStoreDto: UpdateVectorStoreDto) {
        return this.vectorStoreService.update(id, updateVectorStoreDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a vector store' })
    remove(@Param('id') id: string) {
        return this.vectorStoreService.remove(id);
    }
}
