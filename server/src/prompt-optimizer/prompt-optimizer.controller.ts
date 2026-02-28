import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PromptOptimizerService } from './prompt-optimizer.service.js';
import { CreatePromptOptimizationDto } from './dto/create-prompt-optimization.dto.js';

@ApiTags('Prompt Optimizer')
@Controller('prompt-optimizer')
export class PromptOptimizerController {
  constructor(
    private readonly promptOptimizerService: PromptOptimizerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Optimize a prompt and store the result' })
  @ApiResponse({
    status: 201,
    description: 'Prompt optimized successfully',
  })
  optimize(@Body() dto: CreatePromptOptimizationDto) {
    return this.promptOptimizerService.optimize(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all prompt optimizations' })
  @ApiResponse({
    status: 200,
    description: 'List of all prompt optimizations',
  })
  findAll() {
    return this.promptOptimizerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a prompt optimization by ID' })
  @ApiParam({ name: 'id', description: 'Prompt optimization ID' })
  @ApiResponse({ status: 200, description: 'Prompt optimization found' })
  @ApiResponse({
    status: 404,
    description: 'Prompt optimization not found',
  })
  findOne(@Param('id') id: string) {
    return this.promptOptimizerService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a prompt optimization' })
  @ApiParam({ name: 'id', description: 'Prompt optimization ID' })
  @ApiResponse({
    status: 200,
    description: 'Prompt optimization deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Prompt optimization not found',
  })
  remove(@Param('id') id: string) {
    return this.promptOptimizerService.remove(id);
  }
}
