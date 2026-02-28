import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RagChatController } from './rag-chat.controller.js';
import { RagChatService } from './rag-chat.service.js';
import {
  RagConversation,
  RagConversationSchema,
} from './schemas/rag-conversation.schema.js';
import { LangchainModule } from '../langchain/langchain.module.js';
import { AgentConfigModule } from '../agent-config/agent-config.module.js';
import { VectorStoreModule } from '../vector-store/vector-store.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RagConversation.name, schema: RagConversationSchema },
    ]),
    LangchainModule,
    AgentConfigModule,
    VectorStoreModule,
  ],
  controllers: [RagChatController],
  providers: [RagChatService],
})
export class RagChatModule { }
