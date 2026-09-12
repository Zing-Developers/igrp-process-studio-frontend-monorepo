import type {
  BpmDiagramDTO,
  EmailAccessMappingDTO,
  EmailAccessMappingRequestDTO,
  EnumItemString,
  M2mKeyCreatedDTO,
  M2mKeyRequestDTO,
  M2mKeySummaryDTO,
  ProcessDefinitionRequestDTO,
  ProcessDefinitionResponseDTO,
  ProcessDefinitionFilter,
  ProcessVariableRequestDTO,
  ProcessVariableResponseDTO,
  ProjectFilter,
  ProjectProcessFilter,
  ProjectRequestDTO,
  ProjectResponseDTO,
  WrapperListaProcessDefinitionDTO,
  WrapperListaProjectDTO,
} from './index.js';

export interface ProcessStudioClientConfig {
  /** Defaults to NEXT_PUBLIC_API_GATEWAY when available. */
  baseUrl?: string;
  /** Sent as an Authorization bearer token unless that header is explicitly overridden. */
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ProcessStudioClient {
  projects: {
    getAll: (filter?: ProjectFilter) => Promise<WrapperListaProjectDTO>;
    getById: (projectId: string) => Promise<ProjectResponseDTO>;
    create: (project: ProjectRequestDTO) => Promise<ProjectResponseDTO>;
    update: (projectId: string, project: ProjectRequestDTO) => Promise<ProjectResponseDTO>;
    createOrUpdate: (
      project: ProjectRequestDTO & { projectId?: string },
    ) => Promise<ProjectResponseDTO>;
    enable: (projectId: string) => Promise<string>;
    disable: (projectId: string) => Promise<string>;
    getHistory: (projectId: string, filter?: ProjectProcessFilter) => Promise<ProjectResponseDTO>;
    getDeployed: (projectId: string, filter?: ProjectProcessFilter) => Promise<ProjectResponseDTO>;
  };
  processDefinitions: {
    getAll: () => Promise<ProcessDefinitionResponseDTO[]>;
    list: (filter?: ProcessDefinitionFilter) => Promise<WrapperListaProcessDefinitionDTO>;
    getById: (processId: string) => Promise<ProcessDefinitionResponseDTO>;
    delete: (processId: string) => Promise<string>;
    restore: (processId: string) => Promise<string>;
    create: (
      projectId: string,
      processDefinition: ProcessDefinitionRequestDTO,
    ) => Promise<ProcessDefinitionResponseDTO>;
    update: (
      processId: string,
      processDefinition: ProcessDefinitionRequestDTO,
    ) => Promise<ProcessDefinitionResponseDTO>;
    createOrUpdate: (
      processDefinition: ProcessDefinitionRequestDTO & { processDefinitionId?: string },
    ) => Promise<ProcessDefinitionResponseDTO>;
    saveDiagram: (
      processKey: string,
      processDefinition: BpmDiagramDTO,
    ) => Promise<ProcessDefinitionResponseDTO>;
    deploy: (
      processKey: string,
      processDefinition: BpmDiagramDTO,
    ) => Promise<ProcessDefinitionResponseDTO>;
    addVariables: (
      processId: string,
      variables: ProcessVariableRequestDTO[],
    ) => Promise<ProcessVariableResponseDTO>;
    /** @deprecated Use addVariables. */
    createOrUpdateVariable: (
      processId: string,
      variables: ProcessVariableRequestDTO[],
    ) => Promise<ProcessVariableResponseDTO>;
    getVariables: (processId: string) => Promise<ProcessVariableResponseDTO>;
  };
  parameterization: {
    getProcessDefinitionState: () => Promise<EnumItemString[]>;
  };
  m2mKeys: {
    list: () => Promise<M2mKeySummaryDTO[]>;
    create: (request: M2mKeyRequestDTO) => Promise<M2mKeyCreatedDTO>;
    rotate: (id: string) => Promise<M2mKeyCreatedDTO>;
    revoke: (id: string) => Promise<void>;
  };
  emailAccessMappings: {
    list: () => Promise<EmailAccessMappingDTO[]>;
    create: (request: EmailAccessMappingRequestDTO) => Promise<EmailAccessMappingDTO>;
    update: (id: string, request: EmailAccessMappingRequestDTO) => Promise<EmailAccessMappingDTO>;
    revoke: (id: string) => Promise<void>;
  };
}
