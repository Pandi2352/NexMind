import type { AgentConfig, AgentTypeValue, AssignProviderDto } from '../types';
import api from './api';

export const agentConfigService = {
  getAll(): Promise<AgentConfig[]> {
    return api.get('/agent-config').then((r) => r.data);
  },

  getProviderForAgent(agentType: AgentTypeValue): Promise<AgentConfig> {
    return api.get(`/agent-config/${agentType}`).then((r) => r.data);
  },

  assign(dto: AssignProviderDto): Promise<AgentConfig> {
    return api.put('/agent-config/assign', dto).then((r) => r.data);
  },

  removeAssignment(agentType: AgentTypeValue): Promise<void> {
    return api.delete(`/agent-config/${agentType}`).then(() => undefined);
  },
};
