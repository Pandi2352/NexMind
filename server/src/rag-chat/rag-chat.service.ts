import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    HumanMessage,
    AIMessage,
    SystemMessage,
    BaseMessage,
} from '@langchain/core/messages';
import { Document } from '@langchain/core/documents';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
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
import { VectorStoreFactory } from '../vector-store/vector-store.factory.js';
import { AddKnowledgeDto } from './dto/add-knowledge.dto.js';

@Injectable()
export class RagChatService {
    private readonly logger = new Logger(RagChatService.name);

    constructor(
        @InjectModel(RagConversation.name)
        private conversationModel: Model<RagConversationDocument>,
        private readonly langchainService: LangchainService,
        private readonly agentConfigService: AgentConfigService,
        private readonly vectorStoreFactory: VectorStoreFactory,
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

    async addKnowledge(
        dto: AddKnowledgeDto,
    ): Promise<{ inserted: number }> {
        this.logger.log(`addKnowledge called with ${dto.texts.length} texts.`);
        const vectorStoreConfig = await this.agentConfigService.getVectorStoreForAgent(AgentType.RAG_CHAT);
        if (!vectorStoreConfig) {
            this.logger.warn('No Vector Store configured for RAG Agent.');
            throw new BadRequestException('No Vector Store configured for RAG Agent. Please configure one first.');
        }

        this.logger.log(`Using Vector Store: ${vectorStoreConfig.name} (Type: ${vectorStoreConfig.type})`);
        const vectorStoreClient = await this.vectorStoreFactory.createVectorStoreClient(vectorStoreConfig);

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        try {
            const documents = dto.texts.map(text => new Document({ pageContent: text, metadata: { timestamp: Date.now() } }));
            const splitDocs = await textSplitter.splitDocuments(documents);
            const processedDocs = this.processDocuments(splitDocs);

            this.logger.log(`Adding ${processedDocs.length} valid chunks to vector store...`);
            if (processedDocs.length > 0) {
                await vectorStoreClient.addDocuments(processedDocs);
            }

            this.logger.log(`Successfully added ${processedDocs.length} knowledge chunks.`);
            return { inserted: processedDocs.length };
        } catch (error) {
            this.logger.error('Error adding documents to vector store', error.stack);
            throw new BadRequestException(`Failed to add knowledge to vector store: ${error.message}`);
        }
    }

    async uploadKnowledge(file: Express.Multer.File): Promise<{ inserted: number }> {
        this.logger.log(`uploadKnowledge called with file: ${file.originalname}, mimetype: ${file.mimetype}`);
        const vectorStoreConfig = await this.agentConfigService.getVectorStoreForAgent(AgentType.RAG_CHAT);
        if (!vectorStoreConfig) {
            this.logger.warn('No Vector Store configured for RAG Agent.');
            throw new BadRequestException('No Vector Store configured for RAG Agent. Please configure one first.');
        }

        let documents: Document[] = [];
        try {
            if (file.mimetype === 'application/pdf') {
                const blob = new Blob([new Uint8Array(file.buffer)], { type: 'application/pdf' });
                const loader = new PDFLoader(blob);
                documents = await loader.load();
            } else if (file.mimetype.includes('text/') || file.mimetype === 'application/json' || file.originalname.endsWith('.md')) {
                const text = file.buffer.toString('utf8');
                documents = [new Document({ pageContent: text, metadata: { source: file.originalname } })];
            } else {
                throw new BadRequestException(`Unsupported file type: ${file.mimetype}. Please upload a PDF, TXT, or MD file.`);
            }

            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
            });

            const splitDocs = await textSplitter.splitDocuments(documents);
            this.logger.log(`Split document into ${splitDocs.length} initial chunks.`);

            if (splitDocs.length === 0) {
                this.logger.error('Document splitting resulted in ZERO documents. Check if PDF content is readable.');
                throw new BadRequestException('No text could be extracted from the document.');
            }

            const processedDocs = this.processDocuments(splitDocs).map(doc => ({
                ...doc,
                metadata: { ...doc.metadata, source: file.originalname, timestamp: Date.now() }
            }));

            this.logger.log(`Using Vector Store: ${vectorStoreConfig.name}. Adding ${processedDocs.length} sanitized chunks.`);
            if (processedDocs.length > 0) {
                this.logger.log(`Preview of first chunk: ${processedDocs[0].pageContent.substring(0, 100)}...`);
            }
            const vectorStoreClient = await this.vectorStoreFactory.createVectorStoreClient(vectorStoreConfig);

            if (processedDocs.length > 0) {
                await vectorStoreClient.addDocuments(processedDocs);
            }

            this.logger.log(`Successfully added ${processedDocs.length} document chunks to vector store.`);
            return { inserted: processedDocs.length };
        } catch (error) {
            this.logger.error(`Error processing or adding document upload: ${error.message}`);
            this.logger.error(error.stack);
            if (error.response) {
                this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
            }
            throw new BadRequestException(`Failed to upload and process knowledge: ${error.message}`);
        }
    }

    async sendMessage(
        id: string,
        dto: SendRagMessageDto,
    ): Promise<{ reply: string; conversation: RagConversationDocument }> {
        const conversation = await this.findOne(id);
        const chatModel = await this.langchainService.createChatModelForAgent(AgentType.RAG_CHAT);
        const vectorStoreConfig = await this.agentConfigService.getVectorStoreForAgent(AgentType.RAG_CHAT);

        let systemContext = conversation.systemPrompt || '';

        let retrievedContextText = '';
        if (vectorStoreConfig) {
            try {
                this.logger.log(`Performing RAG retrieval for query: "${dto.content}" using Vector Store: ${vectorStoreConfig.name}`);
                const vectorStoreClient = await this.vectorStoreFactory.createVectorStoreClient(vectorStoreConfig);
                const retriever = vectorStoreClient.asRetriever(4); // Increase to 4 results

                const retrievedDocs = await retriever.invoke(dto.content);
                this.logger.log(`Retrieved ${retrievedDocs?.length || 0} documents from Vector Store.`);

                if (retrievedDocs && retrievedDocs.length > 0) {
                    retrievedDocs.forEach((doc, i) => {
                        this.logger.log(`Chunk ${i + 1} Preview: ${doc.pageContent.substring(0, 50)}...`);
                    });
                    retrievedContextText = retrievedDocs.map(doc => doc.pageContent).join('\n\n');

                    const ragHeader = `\n\n[CRITICAL CONTEXT MEMORY FROM UPLOADED DOCUMENTS]\nUse the following information to answer the user's question. If the information is not in the context, say you don't know based on the provided documents.\n\nDOCUMENTS CONTENT:\n${retrievedContextText}\n[END OF DOCUMENTS CONTENT]`;

                    systemContext += ragHeader;
                } else {
                    this.logger.warn('No relevant documents found in Vector Store for this query.');
                }
            } catch (err) {
                this.logger.error('Vector Store retrieval failed', err.stack);
                systemContext += `\n\n[Warning: Vector Store retrieval failed - ${err.message}]`;
            }
        } else {
            this.logger.warn('No Vector Store configured for RAG Agent.');
        }

        this.logger.log(`Final System Message Length: ${systemContext.length}`);
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

    private sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
        const sanitized: Record<string, any> = {};
        for (const key of Object.keys(metadata)) {
            const value = metadata[key];
            if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                sanitized[key] = value;
            } else if (Array.isArray(value)) {
                if (value.every(v => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null)) {
                    sanitized[key] = value;
                } else {
                    sanitized[key] = JSON.stringify(value);
                }
            } else {
                sanitized[key] = JSON.stringify(value);
            }
        }
        return sanitized;
    }

    private processDocuments(splitDocs: Document[]): Document[] {
        return splitDocs
            .filter(doc => doc.pageContent && doc.pageContent.trim().length > 0)
            .map(doc => ({
                ...doc,
                metadata: this.sanitizeMetadata(doc.metadata)
            }) as Document);
    }
}
