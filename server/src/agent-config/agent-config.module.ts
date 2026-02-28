import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentConfig, AgentConfigSchema } from './schemas/agent-config.schema.js';
import { AgentConfigController } from './agent-config.controller.js';
import { AgentConfigService } from './agent-config.service.js';
import { AiProviderModule } from '../ai-provider/ai-provider.module.js';
import { VectorStoreModule } from '../vector-store/vector-store.module.js';

@Module({
  imports: [
    AiProviderModule,
    forwardRef(() => VectorStoreModule),
    MongooseModule.forFeature([
      { name: AgentConfig.name, schema: AgentConfigSchema },
    ]),
  ],
  controllers: [AgentConfigController],
  providers: [AgentConfigService],
  exports: [AgentConfigService],
})
export class AgentConfigModule { }
