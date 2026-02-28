import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SummarizerService } from './summarizer.service.js';
import { CreateSummaryDto } from './dto/create-summary.dto.js';

@ApiTags('Summarizer')
@Controller('summarizer')
export class SummarizerController {
  constructor(private readonly summarizerService: SummarizerService) {}

  @Post()
  @ApiOperation({ summary: 'Summarize text and store the result' })
  @ApiResponse({
    status: 201,
    description: 'Summary completed successfully',
  })
  summarize(@Body() dto: CreateSummaryDto) {
    return this.summarizerService.summarize(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all summaries' })
  @ApiResponse({ status: 200, description: 'List of all summaries' })
  findAll() {
    return this.summarizerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a summary by ID' })
  @ApiParam({ name: 'id', description: 'Summary ID' })
  @ApiResponse({ status: 200, description: 'Summary found' })
  @ApiResponse({ status: 404, description: 'Summary not found' })
  findOne(@Param('id') id: string) {
    return this.summarizerService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a summary' })
  @ApiParam({ name: 'id', description: 'Summary ID' })
  @ApiResponse({
    status: 200,
    description: 'Summary deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Summary not found' })
  remove(@Param('id') id: string) {
    return this.summarizerService.remove(id);
  }
}
