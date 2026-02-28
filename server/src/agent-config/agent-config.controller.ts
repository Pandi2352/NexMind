import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AgentConfigService } from './agent-config.service';
import { AssignProviderDto } from './dto/assign-provider.dto';
import { AgentType } from './enums/agent-type.enum';

@ApiTags('Agent Config')
@Controller('agent-config')
export class AgentConfigController {
  constructor(private readonly agentConfigService: AgentConfigService) {}

  @Put('assign')
  @ApiOperation({ summary: 'Assign or reassign an AI provider to an agent' })
  assign(@Body() dto: AssignProviderDto) {
    return this.agentConfigService.assignProvider(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all agent-provider assignments' })
  findAll() {
    return this.agentConfigService.findAll();
  }

  @Get(':agentType')
  @ApiOperation({ summary: 'Get the effective provider for an agent' })
  @ApiParam({ name: 'agentType', enum: AgentType })
  getProviderForAgent(@Param('agentType') agentType: AgentType) {
    return this.agentConfigService.getProviderForAgent(agentType);
  }

  @Delete(':agentType')
  @ApiOperation({ summary: 'Remove provider assignment (reverts to global active)' })
  @ApiParam({ name: 'agentType', enum: AgentType })
  removeAssignment(@Param('agentType') agentType: AgentType) {
    return this.agentConfigService.removeAssignment(agentType);
  }
}
