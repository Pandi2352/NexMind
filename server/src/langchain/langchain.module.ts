import { Module } from '@nestjs/common';
import { AiProviderModule } from '../ai-provider/ai-provider.module.js';
import { AgentConfigModule } from '../agent-config/agent-config.module.js';
import { LangchainService } from './langchain.service.js';

@Module({
  imports: [AiProviderModule, AgentConfigModule],
  providers: [LangchainService],
  exports: [LangchainService],
})
export class LangchainModule {}
