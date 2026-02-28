import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    HumanMessage,
    AIMessage,
    SystemMessage,
    BaseMessage,
} from '@langchain/core/messages';
import {
    RagConversation,
    RagConversationDocument,
} from './schemas/rag-conversation.schema.js';
import { CreateRagConversationDto } from './dto/create-rag-conversation.dto.js';
import { SendRagMessageDto } from './dto/send-rag-message.dto.js';
import { LangchainService } from '../langchain/langchain.service.js';
import { AgentConfigService } from '../agent-config/agent-config.service.js';
import { AgentType } from '../agent-config/enums/agent-type.enum.js';
import { MessageRole } from './enums/message-role.enum.js';

@Injectable()
export class RagChatService {
    constructor(
        @InjectModel(RagConversation.name)
        private conversationModel: Model<RagConversationDocument>,
        private readonly langchainService: LangchainService,
        private readonly agentConfigService: AgentConfigService,
    ) { }

    async createConversation(
        dto: CreateRagConversationDto,
    ): Promise<RagConversationDocument> {
        const conversation = new this.conversationModel(dto);
        return conversation.save();
    }

    async findAll(): Promise<RagConversationDocument[]> {
        return this.conversationModel.find().select('-messages').exec();
    }

    async findOne(id: string): Promise<RagConversationDocument> {
        const conversation = await this.conversationModel.findById(id).exec();
        if (!conversation) {
            throw new NotFoundException(`RAG Conversation with ID "${id}" not found`);
        }
        return conversation;
    }

    async sendMessage(
        id: string,
        dto: SendRagMessageDto,
    ): Promise<{ reply: string; conversation: RagConversationDocument }> {
        const conversation = await this.findOne(id);
        const chatModel = await this.langchainService.createChatModelForAgent(AgentType.RAG_CHAT);
        const vectorStoreConfig = await this.agentConfigService.getVectorStoreForAgent(AgentType.RAG_CHAT);

        let systemContext = conversation.systemPrompt || '';
        if (vectorStoreConfig) {
            // Here you would implement actual vector store retrieval
            systemContext += `\n\n[System Info: Retrieval Augmented Generation is enabled for vector store "${vectorStoreConfig.name}" (Type: ${vectorStoreConfig.type}). Simulating retrieved content for the prompt...]`;
        } else {
            systemContext += `\n\n[Warning: No Vector Store configured for RAG Agent. Ensure one is selected in Agent Config.]`;
        }

        const messages = this.buildMessageArray(conversation, dto.content, systemContext);
        const response = await chatModel.invoke(messages);

        const aiReply =
            typeof response.content === 'string'
                ? response.content
                : JSON.stringify(response.content);

        conversation.messages.push(
            { role: MessageRole.HUMAN, content: dto.content } as any,
            { role: MessageRole.AI, content: aiReply } as any,
        );

        await conversation.save();

        return { reply: aiReply, conversation };
    }

    async remove(id: string): Promise<RagConversationDocument> {
        const conversation = await this.conversationModel
            .findByIdAndDelete(id)
            .exec();
        if (!conversation) {
            throw new NotFoundException(`RAG Conversation with ID "${id}" not found`);
        }
        return conversation;
    }

    private buildMessageArray(
        conversation: RagConversationDocument,
        newMessage: string,
        systemContext: string
    ): BaseMessage[] {
        const messages: BaseMessage[] = [];

        if (systemContext) {
            messages.push(new SystemMessage(systemContext));
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
