import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  BaseMessage,
} from '@langchain/core/messages';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema.js';
import { CreateConversationDto } from './dto/create-conversation.dto.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { LangchainService } from '../langchain/langchain.service.js';
import { AgentType } from '../agent-config/enums/agent-type.enum.js';
import { MessageRole } from './enums/message-role.enum.js';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private readonly langchainService: LangchainService,
  ) {}

  async createConversation(
    dto: CreateConversationDto,
  ): Promise<ConversationDocument> {
    const conversation = new this.conversationModel(dto);
    return conversation.save();
  }

  async findAll(): Promise<ConversationDocument[]> {
    return this.conversationModel.find().select('-messages').exec();
  }

  async findOne(id: string): Promise<ConversationDocument> {
    const conversation = await this.conversationModel.findById(id).exec();
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID "${id}" not found`);
    }
    return conversation;
  }

  async sendMessage(
    id: string,
    dto: SendMessageDto,
  ): Promise<{ reply: string; conversation: ConversationDocument }> {
    const conversation = await this.findOne(id);
    const chatModel = await this.langchainService.createChatModelForAgent(AgentType.CHAT);

    const messages = this.buildMessageArray(conversation, dto.message);
    const response = await chatModel.invoke(messages);

    const aiReply =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    conversation.messages.push(
      { role: MessageRole.HUMAN, content: dto.message } as any,
      { role: MessageRole.AI, content: aiReply } as any,
    );

    await conversation.save();

    return { reply: aiReply, conversation };
  }

  async remove(id: string): Promise<ConversationDocument> {
    const conversation = await this.conversationModel
      .findByIdAndDelete(id)
      .exec();
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID "${id}" not found`);
    }
    return conversation;
  }

  private buildMessageArray(
    conversation: ConversationDocument,
    newMessage: string,
  ): BaseMessage[] {
    const messages: BaseMessage[] = [];

    if (conversation.systemPrompt) {
      messages.push(new SystemMessage(conversation.systemPrompt));
    }

    const recentMessages = conversation.messages.slice(-50);
    for (const msg of recentMessages) {
      switch (msg.role) {
        case MessageRole.HUMAN:
          messages.push(new HumanMessage(msg.content));
          break;
        case MessageRole.AI:
          messages.push(new AIMessage(msg.content));
          break;
        case MessageRole.SYSTEM:
          messages.push(new SystemMessage(msg.content));
          break;
      }
    }

    messages.push(new HumanMessage(newMessage));
    return messages;
  }
}
