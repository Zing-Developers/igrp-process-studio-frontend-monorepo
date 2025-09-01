import type {
  Project,
  ProcessDefinition,
  PaginatedResponse,
  ProcessDefinitionContent,
  VariableDefinition,
} from './index';

export interface ProcessStudioClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ProcessStudioClient {
  projects: {
    getAll: () => Promise<PaginatedResponse<Project>>;
    getById: (id: string) => Promise<Project>;
    create: (project: Project) => Promise<Project>;
    update: (project: Project) => Promise<Project>;
    createOrUpdate: (project: Project) => Promise<Project>;
    delete: (code: string) => Promise<any>;
  };
  processDefinitions: {
    getAll: () => Promise<ProcessDefinition[]>;
    getById: (id: string) => Promise<ProcessDefinition>;
    delete: (id: string) => Promise<any>;
    create: (projectId: string, processDefinition: ProcessDefinition) => Promise<ProcessDefinition>;
    update: (projectId: string, processDefinition: ProcessDefinition) => Promise<ProcessDefinition>;
    createOrUpdate: (processDefinition: ProcessDefinition) => Promise<ProcessDefinition>;
    saveDiagram: (
      processkey: string,
      processDefinition: ProcessDefinitionContent,
    ) => Promise<Response>;
    deploy: (processkey: string, processDefinition: ProcessDefinitionContent) => Promise<Response>;
    createOrUpdateVariable: (
      processDefinitionId: string,
      variable: VariableDefinition[],
    ) => Promise<VariableDefinition[]>;
    getVariables: (processDefinitionId: string) => Promise<VariableDefinition[]>;
  };
}
