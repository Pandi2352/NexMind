import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RagChatService } from './rag-chat.service.js';
import { CreateRagConversationDto } from './dto/create-rag-conversation.dto.js';
import { SendRagMessageDto } from './dto/send-rag-message.dto.js';
import { AddKnowledgeDto } from './dto/add-knowledge.dto.js';

@ApiTags('rag-chat')
@Controller('rag-chat/conversations')
export class RagChatController {
    constructor(private readonly ragChatService: RagChatService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new RAG conversation' })
    @ApiResponse({ status: 201, description: 'Created successfully.' })
    create(@Body() createRagConversationDto: CreateRagConversationDto) {
        return this.ragChatService.createConversation(createRagConversationDto);
    }

    @Post('knowledge')
    @ApiOperation({ summary: 'Add external knowledge to the active Vector Store mapped to RAG Agent' })
    @ApiResponse({ status: 201, description: 'Knowledge added successfully.' })
    addKnowledge(@Body() addKnowledgeDto: AddKnowledgeDto) {
        return this.ragChatService.addKnowledge(addKnowledgeDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all RAG conversations (without messages)' })
    findAll() {
        return this.ragChatService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a RAG conversation by ID (with messages)' })
    @ApiParam({ name: 'id', description: 'Conversation ID' })
    findOne(@Param('id') id: string) {
        return this.ragChatService.findOne(id);
    }

    @Post(':id/messages')
    @ApiOperation({ summary: 'Send a message in a RAG conversation and get AI reply' })
    @ApiParam({ name: 'id', description: 'Conversation ID' })
    sendMessage(
        @Param('id') id: string,
        @Body() sendRagMessageDto: SendRagMessageDto,
    ) {
        return this.ragChatService.sendMessage(id, sendRagMessageDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a RAG conversation' })
    @ApiParam({ name: 'id', description: 'Conversation ID' })
    remove(@Param('id') id: string) {
        return this.ragChatService.remove(id);
    }
}
