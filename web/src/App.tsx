import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AiProvidersPage } from './pages/ai-providers/AiProvidersPage';
import { AgentConfigPage } from './pages/agent-config/AgentConfigPage';
import { ChatPage } from './pages/chat/ChatPage';
import { TranslatorPage } from './pages/translator/TranslatorPage';
import { SummarizerPage } from './pages/summarizer/SummarizerPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/providers" replace />} />
          <Route path="providers" element={<AiProvidersPage />} />
          <Route path="agent-config" element={<AgentConfigPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="translator" element={<TranslatorPage />} />
          <Route path="summarizer" element={<SummarizerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
