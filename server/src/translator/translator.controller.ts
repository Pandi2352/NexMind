import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TranslatorService } from './translator.service.js';
import { CreateTranslationDto } from './dto/create-translation.dto.js';

@ApiTags('Translator')
@Controller('translator')
export class TranslatorController {
  constructor(private readonly translatorService: TranslatorService) {}

  @Post()
  @ApiOperation({ summary: 'Translate text and store the result' })
  @ApiResponse({ status: 201, description: 'Translation completed successfully' })
  translate(@Body() dto: CreateTranslationDto) {
    return this.translatorService.translate(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all translations' })
  @ApiResponse({ status: 200, description: 'List of all translations' })
  findAll() {
    return this.translatorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a translation by ID' })
  @ApiParam({ name: 'id', description: 'Translation ID' })
  @ApiResponse({ status: 200, description: 'Translation found' })
  @ApiResponse({ status: 404, description: 'Translation not found' })
  findOne(@Param('id') id: string) {
    return this.translatorService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a translation' })
  @ApiParam({ name: 'id', description: 'Translation ID' })
  @ApiResponse({ status: 200, description: 'Translation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Translation not found' })
  remove(@Param('id') id: string) {
    return this.translatorService.remove(id);
  }
}
