# NexMind API

A NestJS backend powering the NexMind workbench — manage multiple AI providers and route them to pluggable agents (chat, translator, summarizer, and more) via LangChain.

## Features

- **AI Provider Management** — CRUD for AI providers with an active-provider toggle
- **Provider-Agnostic Chat** — Single chatbot module that works with any configured provider via LangChain's `BaseChatModel`
- **Conversation History** — MongoDB-backed conversations with embedded messages
- **Swagger Docs** — Auto-generated API documentation

## Tech Stack

- **NestJS** — Application framework
- **MongoDB / Mongoose** — Database & ODM
- **LangChain** — Unified LLM interface (`@langchain/ollama`, `@langchain/google-genai`)
- **Swagger** — API documentation

## Project Structure

```
src/
├── ai-provider/              # AI Provider CRUD module
│   ├── dto/
│   │   ├── create-ai-provider.dto.ts
│   │   └── update-ai-provider.dto.ts
│   ├── enums/
│   │   └── ai-provider-name.enum.ts
│   ├── schemas/
│   │   └── ai-provider.schema.ts
│   ├── ai-provider.controller.ts
│   ├── ai-provider.module.ts
│   └── ai-provider.service.ts
├── langchain/                # Shared LangChain model factory
│   ├── langchain.module.ts
│   └── langchain.service.ts
├── chat/                     # Chatbot feature module
│   ├── dto/
│   │   ├── create-conversation.dto.ts
│   │   └── send-message.dto.ts
│   ├── enums/
│   │   └── message-role.enum.ts
│   ├── schemas/
│   │   ├── conversation.schema.ts
│   │   └── message.schema.ts
│   ├── chat.controller.ts
│   ├── chat.module.ts
│   └── chat.service.ts
├── config/
│   ├── database.config.ts
│   └── swagger.config.ts
├── app.module.ts
└── main.ts
```

## Prerequisites

- **Node.js** >= 18
- **MongoDB** running locally or a remote connection string
- At least one AI provider available:
  - [Ollama](https://ollama.ai/) running locally (default `http://localhost:11434`), or
  - Ollama cloud instance with a base URL, or
  - Google Gemini API key

## Setup

```bash
# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env
# Edit .env with your MONGODB_URI if not using default
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb://localhost:27017/ailearning` | MongoDB connection string |
| `PORT` | `1000` | Server port |

## Running

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## API Documentation

Once running, Swagger UI is available at:

```
http://localhost:1000/api/docs
```

## API Endpoints

### AI Providers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai-provider` | Create a new AI provider |
| GET | `/ai-provider` | List all providers |
| GET | `/ai-provider/active/current` | Get the active provider |
| GET | `/ai-provider/:id` | Get provider by ID |
| PATCH | `/ai-provider/:id` | Update a provider |
| PATCH | `/ai-provider/:id/set-active` | Set provider as active |
| DELETE | `/ai-provider/:id` | Delete a provider |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/conversations` | Create a new conversation |
| GET | `/chat/conversations` | List all conversations |
| GET | `/chat/conversations/:id` | Get conversation with full history |
| POST | `/chat/conversations/:id/messages` | Send a message and get AI reply |
| DELETE | `/chat/conversations/:id` | Delete a conversation |

## Quick Start Guide

### 1. Create an AI Provider

```bash
# Ollama Local (default base URL: http://localhost:11434)
curl -X POST http://localhost:1000/ai-provider \
  -H "Content-Type: application/json" \
  -d '{
    "aiProviderName": "ollama local",
    "modelName": "llama3.2"
  }'

# Gemini
curl -X POST http://localhost:1000/ai-provider \
  -H "Content-Type: application/json" \
  -d '{
    "aiProviderName": "gemini",
    "modelName": "gemini-2.0-flash",
    "apiKey": "your-gemini-api-key"
  }'
```

### 2. Activate the Provider

```bash
curl -X PATCH http://localhost:1000/ai-provider/<provider-id>/set-active
```

### 3. Create a Conversation

```bash
curl -X POST http://localhost:1000/chat/conversations \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Chat",
    "systemPrompt": "You are a helpful assistant."
  }'
```

### 4. Send a Message

```bash
curl -X POST http://localhost:1000/chat/conversations/<conversation-id>/messages \
  -H "Content-Type: application/json" \
  -d '{ "message": "Hello, how are you?" }'
```

The response includes the AI reply and the updated conversation.

### 5. View Conversation History

```bash
curl http://localhost:1000/chat/conversations/<conversation-id>
```

## Architecture Notes

- **LangchainModule** is a shared infrastructure module. Any future module (RAG, summarizer, agents) can import it to get a configured `BaseChatModel` for the active provider.
- **ChatService.sendMessage()** builds a `BaseMessage[]` array from the system prompt + last 50 messages + the new human message, then calls `chatModel.invoke()`.
- Provider SDKs (`@langchain/ollama`, `@langchain/google-genai`) are loaded via dynamic `import()` so only the active provider's SDK is loaded at runtime.

## Supported Providers

| Provider | Required Fields | Notes |
|----------|----------------|-------|
| `ollama local` | `modelName` | Defaults to `http://localhost:11434` |
| `ollama cloud` | `modelName`, `baseUrl` | Remote Ollama instance |
| `gemini` | `modelName`, `apiKey` | Google Gemini API |
