import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller.js';
import { ChatService } from './chat.service.js';
import { LangchainModule } from '../langchain/langchain.module.js';
import {
  Conversation,
  ConversationSchema,
} from './schemas/conversation.schema.js';

@Module({
  imports: [
    LangchainModule,
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
