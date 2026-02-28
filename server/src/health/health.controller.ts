import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { HealthService } from './health.service.js';
import { CreateHealthConsultationDto } from './dto/create-health-consultation.dto.js';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post()
  @ApiOperation({ summary: 'Get health advice based on symptoms' })
  @ApiResponse({
    status: 201,
    description: 'Health consultation completed successfully',
  })
  consult(@Body() dto: CreateHealthConsultationDto) {
    return this.healthService.consult(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all health consultations' })
  @ApiResponse({ status: 200, description: 'List of all consultations' })
  findAll() {
    return this.healthService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a health consultation by ID' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation found' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  findOne(@Param('id') id: string) {
    return this.healthService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a health consultation' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({
    status: 200,
    description: 'Consultation deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  remove(@Param('id') id: string) {
    return this.healthService.remove(id);
  }
}
