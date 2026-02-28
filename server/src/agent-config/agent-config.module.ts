import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentConfig, AgentConfigSchema } from './schemas/agent-config.schema';
import { AgentConfigController } from './agent-config.controller';
import { AgentConfigService } from './agent-config.service';
import { AiProviderModule } from '../ai-provider/ai-provider.module';

@Module({
  imports: [
    AiProviderModule,
    MongooseModule.forFeature([
      { name: AgentConfig.name, schema: AgentConfigSchema },
    ]),
  ],
  controllers: [AgentConfigController],
  providers: [AgentConfigService],
  exports: [AgentConfigService],
})
export class AgentConfigModule {}
