import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AiProviderService } from './ai-provider.service';
import { CreateAiProviderDto } from './dto/create-ai-provider.dto';
import { UpdateAiProviderDto } from './dto/update-ai-provider.dto';

@ApiTags('AI Providers')
@Controller('ai-provider')
export class AiProviderController {
  constructor(private readonly aiProviderService: AiProviderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new AI provider' })
  @ApiResponse({ status: 201, description: 'AI provider created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() createAiProviderDto: CreateAiProviderDto) {
    return this.aiProviderService.create(createAiProviderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all AI providers' })
  @ApiResponse({ status: 200, description: 'List of all AI providers' })
  findAll() {
    return this.aiProviderService.findAll();
  }

  @Get('active/current')
  @ApiOperation({ summary: 'Get the currently active AI provider' })
  @ApiResponse({ status: 200, description: 'Currently active AI provider' })
  @ApiResponse({ status: 404, description: 'No active AI provider configured' })
  getActive() {
    return this.aiProviderService.getActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an AI provider by ID' })
  @ApiParam({ name: 'id', description: 'AI provider ID' })
  @ApiResponse({ status: 200, description: 'AI provider found' })
  @ApiResponse({ status: 404, description: 'AI provider not found' })
  findOne(@Param('id') id: string) {
    return this.aiProviderService.findOne(id);
  }

  @Patch(':id/set-active')
  @ApiOperation({ summary: 'Set an AI provider as the active provider for the whole project' })
  @ApiParam({ name: 'id', description: 'AI provider ID' })
  @ApiResponse({ status: 200, description: 'AI provider set as active' })
  @ApiResponse({ status: 404, description: 'AI provider not found' })
  setActive(@Param('id') id: string) {
    return this.aiProviderService.setActive(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an AI provider' })
  @ApiParam({ name: 'id', description: 'AI provider ID' })
  @ApiResponse({ status: 200, description: 'AI provider updated successfully' })
  @ApiResponse({ status: 404, description: 'AI provider not found' })
  update(
    @Param('id') id: string,
    @Body() updateAiProviderDto: UpdateAiProviderDto,
  ) {
    return this.aiProviderService.update(id, updateAiProviderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an AI provider' })
  @ApiParam({ name: 'id', description: 'AI provider ID' })
  @ApiResponse({ status: 200, description: 'AI provider deleted successfully' })
  @ApiResponse({ status: 404, description: 'AI provider not found' })
  remove(@Param('id') id: string) {
    return this.aiProviderService.remove(id);
  }
}
