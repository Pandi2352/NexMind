# NexMind

An extensible multi-provider AI workbench with pluggable agents. Add new AI-powered agents (chat, translate, summarize, and more) and hot-swap between Ollama and Gemini models per agent — no restart required.

## Architecture

```
nexmind/
├── server/          # NestJS REST API (port 1000)
└── web/             # React + Vite frontend (port 5173)
```

**Backend** — NestJS with MongoDB and LangChain for provider-agnostic LLM access.
**Frontend** — React 19, TypeScript, Tailwind CSS v4, React Router.

## Features

| Feature | Description |
|---------|-------------|
| **AI Providers** | CRUD for Ollama (local/cloud) and Gemini providers with active-provider toggle |
| **Agent Config** | Assign specific providers per agent type, with fallback to global active |
| **Chat** | Multi-conversation chatbot with message history and system prompts |
| **Translator** | AI-powered text translation with language auto-detection and history |
| **Summarizer** | Text summarization with multiple styles (bullet-points, TL;DR, ELI5, etc.) and history |
| **Prompt Optimizer** | Rewrites vague prompts into clear, structured instructions with copy-to-clipboard and history |
| **Health Advisor** | AI-powered symptom analysis, diet planning, and wellness suggestions with history |

## Prerequisites

- **Node.js** >= 18
- **MongoDB** running locally or a remote connection string
- At least one AI provider:
  - [Ollama](https://ollama.ai/) running locally (default `http://localhost:11434`), or
  - Ollama cloud instance with a base URL, or
  - [Google Gemini](https://ai.google.dev/) API key

## Quick Start

### 1. Clone and install

```bash
# Server
cd server
npm install
cp .env.example .env    # edit if needed

# Frontend
cd ../web
npm install
```

### 2. Start MongoDB

```bash
mongod
```

### 3. Run both apps

```bash
# Terminal 1 — Backend
cd server
npm run start:dev       # http://localhost:1000

# Terminal 2 — Frontend
cd web
npm run dev             # http://localhost:5173
```

The frontend proxies `/api` requests to the backend, so no CORS configuration is needed.

### 4. Open the app

Navigate to [http://localhost:5173](http://localhost:5173). You'll land on the **AI Providers** page. From there:

1. **Add a provider** (e.g. Ollama Local with model `llama3.2`)
2. **Set it as active**
3. Go to **Chat** and start a conversation
4. Or go to **Translator** and translate some text
5. Or go to **Summarizer** and summarize a document
6. Or go to **Prompt Optimizer** and refine a prompt
7. Or go to **Health Advisor** for wellness suggestions

## Environment Variables

Configure in `server/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `1000` | Backend server port |
| `MONGODB_URI` | `mongodb://localhost:27017/ailearning` | MongoDB connection string |

## API Documentation

Swagger UI is available at [http://localhost:1000/api/docs](http://localhost:1000/api/docs) when the server is running.

## API Endpoints

### AI Providers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ai-provider` | Create a new provider |
| `GET` | `/ai-provider` | List all providers |
| `GET` | `/ai-provider/active/current` | Get the active provider |
| `GET` | `/ai-provider/:id` | Get provider by ID |
| `PATCH` | `/ai-provider/:id` | Update a provider |
| `PATCH` | `/ai-provider/:id/set-active` | Set as active |
| `DELETE` | `/ai-provider/:id` | Delete a provider |

### Agent Config

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/agent-config/assign` | Assign provider to an agent type |
| `GET` | `/agent-config` | List all assignments |
| `GET` | `/agent-config/:agentType` | Get provider for agent (`chat`, `translator`, `summarizer`, `prompt-optimizer`, `health`) |
| `DELETE` | `/agent-config/:agentType` | Remove assignment (falls back to global active) |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat/conversations` | Create a conversation |
| `GET` | `/chat/conversations` | List all conversations |
| `GET` | `/chat/conversations/:id` | Get conversation with full history |
| `POST` | `/chat/conversations/:id/messages` | Send message and get AI reply |
| `DELETE` | `/chat/conversations/:id` | Delete a conversation |

### Translator

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/translator` | Translate text |
| `GET` | `/translator` | List all translations |
| `GET` | `/translator/:id` | Get translation by ID |
| `DELETE` | `/translator/:id` | Delete a translation |

### Summarizer

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/summarizer` | Summarize text |
| `GET` | `/summarizer` | List all summaries |
| `GET` | `/summarizer/:id` | Get summary by ID |
| `DELETE` | `/summarizer/:id` | Delete a summary |

### Prompt Optimizer

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/prompt-optimizer` | Optimize a prompt |
| `GET` | `/prompt-optimizer` | List all optimizations |
| `GET` | `/prompt-optimizer/:id` | Get optimization by ID |
| `DELETE` | `/prompt-optimizer/:id` | Delete an optimization |

### Health Advisor

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/health` | Request health advice or symptom analysis |
| `GET` | `/health` | List all health advice history |
| `GET` | `/health/:id` | Get health advice by ID |
| `DELETE` | `/health/:id` | Delete health advice |

## Supported Providers

| Provider | Required Fields | Notes |
|----------|----------------|-------|
| `ollama local` | `modelName` | Uses `http://localhost:11434` by default |
| `ollama cloud` | `modelName`, `baseUrl` | Remote Ollama instance |
| `gemini` | `modelName`, `apiKey` | Google Gemini API |

## Project Structure

### Server (`server/`)

```
src/
├── ai-provider/          # Provider CRUD + active toggle
├── agent-config/         # Per-agent provider assignment
├── chat/                 # Conversations & messages
├── translator/           # Text translation
├── summarizer/           # Text summarization
├── prompt-optimizer/     # Prompt rewriting & optimization
├── langchain/            # Shared LLM factory (BaseChatModel)
├── config/               # Database & Swagger config
├── common/utils/         # UUID generation
├── app.module.ts
└── main.ts
```

### Frontend (`web/`)

```
src/
├── types/                # TypeScript interfaces (mirrors backend schemas)
├── services/             # Axios API layer (one per module)
├── hooks/                # React hooks (data fetching + state)
├── components/
│   ├── layout/           # AppShell, Sidebar
│   └── ui/               # LoadingSpinner, EmptyState, ConfirmDialog, StatusBadge
├── pages/
│   ├── ai-providers/     # Provider CRUD page
│   ├── agent-config/     # Agent-provider assignment page
│   ├── chat/             # Chat interface (conversations + messages)
│   ├── translator/       # Translation form + history
│   ├── summarizer/       # Summarization form + history
│   ├── prompt-optimizer/ # Prompt optimization + copy + history
│   ├── health/           # Health Advisor interface + history
├── App.tsx               # Router setup
└── main.tsx              # Entry point
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Framework | NestJS 11 |
| Database | MongoDB + Mongoose |
| LLM Integration | LangChain (`@langchain/ollama`, `@langchain/google-genai`) |
| API Docs | Swagger (`@nestjs/swagger`) |
| Frontend Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Language | TypeScript (strict mode) |
