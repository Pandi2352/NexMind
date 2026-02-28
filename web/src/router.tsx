import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AiProvidersPage } from './pages/ai-providers/AiProvidersPage';
import { AgentConfigPage } from './pages/agent-config/AgentConfigPage';
import { ChatPage } from './pages/chat/ChatPage';
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
        path: 'agent-config',
        element: <AgentConfigPage />
      },
      {
        path: 'chat',
        element: <ChatPage />
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
