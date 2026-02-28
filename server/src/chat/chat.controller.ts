import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ChatService } from './chat.service.js';
import { CreateConversationDto } from './dto/create-conversation.dto.js';
import { SendMessageDto } from './dto/send-message.dto.js';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created successfully' })
  create(@Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(dto);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'List all conversations (without messages)' })
  @ApiResponse({ status: 200, description: 'List of all conversations' })
  findAll() {
    return this.chatService.findAll();
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get a conversation with full message history' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 200, description: 'Conversation found' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(id);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send a message and get AI reply' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 201, description: 'Message sent and AI replied' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(id, dto);
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Delete a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 200, description: 'Conversation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  remove(@Param('id') id: string) {
    return this.chatService.remove(id);
  }
}
