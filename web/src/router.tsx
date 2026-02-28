import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AiProvidersPage } from './pages/ai-providers/AiProvidersPage';
import { VectorStoresPage } from './pages/vector-stores/VectorStoresPage';
import { AgentConfigPage } from './pages/agent-config/AgentConfigPage';
import { ChatPage } from './pages/chat/ChatPage';
import { RagChatPage } from './pages/rag-chat/RagChatPage';
import { TranslatorPage } from './pages/translator/TranslatorPage';
import { SummarizerPage } from './pages/summarizer/SummarizerPage';
import { PromptOptimizerPage } from './pages/prompt-optimizer/PromptOptimizerPage';
import { HealthPage } from './pages/health/HealthPage';
import { NotFoundPage } from './pages/not-found/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/providers" replace />
      },
      {
        path: 'providers',
        element: <AiProvidersPage />
      },
      {
        path: 'vector-stores',
        element: <VectorStoresPage />
      },
      {
        path: 'agent-config',
        element: <AgentConfigPage />
      },
      {
        path: 'chat',
        element: <ChatPage />
      },
      {
        path: 'rag-chat',
        element: <RagChatPage />
      },
      {
        path: 'translator',
        element: <TranslatorPage />
      },
      {
        path: 'summarizer',
        element: <SummarizerPage />
      },
      {
        path: 'prompt-optimizer',
        element: <PromptOptimizerPage />
      },
      {
        path: 'health',
        element: <HealthPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);
