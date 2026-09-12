import type {
  BpmDiagramDTO,
  EmailAccessMappingDTO,
  EmailAccessMappingRequestDTO,
  EnumItemString,
  M2mKeyCreatedDTO,
  M2mKeyRequestDTO,
  M2mKeySummaryDTO,
  ProcessDefinitionFilter,
  ProcessDefinitionRequestDTO,
  ProcessDefinitionResponseDTO,
  ProcessVariableRequestDTO,
  ProcessVariableResponseDTO,
  ProjectFilter,
  ProjectProcessFilter,
  ProjectRequestDTO,
  ProjectResponseDTO,
  WrapperListaProcessDefinitionDTO,
  WrapperListaProjectDTO,
} from '@irn/framework-process-studio-types';
import { BaseApiClient } from './base-api-client.js';
import type { ApiClientConfig } from './types.js';

const encodePathSegment = (value: string): string => encodeURIComponent(value);

export class ProcessStudioApiClient extends BaseApiClient {
  constructor(config: ApiClientConfig) {
    super(config);
  }

  async getProjects(filter?: ProjectFilter): Promise<WrapperListaProjectDTO> {
    const response = await this.get<WrapperListaProjectDTO>('/api/v1/projects', filter);
    return response.data;
  }

  async getProjectById(projectId: string): Promise<ProjectResponseDTO> {
    const response = await this.get<ProjectResponseDTO>(
      `/api/v1/projects/${encodePathSegment(projectId)}`,
    );
    return response.data;
  }

  async createProject(project: ProjectRequestDTO): Promise<ProjectResponseDTO> {
    const response = await this.post<ProjectResponseDTO>('/api/v1/projects', project);
    return response.data;
  }

  async updateProject(projectId: string, project: ProjectRequestDTO): Promise<ProjectResponseDTO> {
    const response = await this.put<ProjectResponseDTO>(
      `/api/v1/projects/${encodePathSegment(projectId)}`,
      project,
    );
    return response.data;
  }

  async enableProject(projectId: string): Promise<string> {
    const response = await this.patch<string>(
      `/api/v1/projects/${encodePathSegment(projectId)}/enable`,
    );
    return response.data;
  }

  async disableProject(projectId: string): Promise<string> {
    const response = await this.patch<string>(
      `/api/v1/projects/${encodePathSegment(projectId)}/disable`,
    );
    return response.data;
  }

  async getProcessHistoryByProjectId(
    projectId: string,
    filter?: ProjectProcessFilter,
  ): Promise<ProjectResponseDTO> {
    const response = await this.get<ProjectResponseDTO>(
      `/api/v1/projects/${encodePathSegment(projectId)}/history-process`,
      filter,
    );
    return response.data;
  }

  async getDeployedProcessByProjectId(
    projectId: string,
    filter?: ProjectProcessFilter,
  ): Promise<ProjectResponseDTO> {
    const response = await this.get<ProjectResponseDTO>(
      `/api/v1/projects/${encodePathSegment(projectId)}/deployed-process`,
      filter,
    );
    return response.data;
  }

  async getProcessDefinitions(
    filter?: ProcessDefinitionFilter,
  ): Promise<WrapperListaProcessDefinitionDTO> {
    const response = await this.get<WrapperListaProcessDefinitionDTO>(
      '/api/v1/projects/process-definitions',
      filter,
    );
    return response.data;
  }

  async getProcessDefinitionById(processId: string): Promise<ProcessDefinitionResponseDTO> {
    const response = await this.get<ProcessDefinitionResponseDTO>(
      `/api/v1/projects/process-definitions/${encodePathSegment(processId)}`,
    );
    return response.data;
  }

  async createProcessDefinition(
    projectId: string,
    processDefinition: ProcessDefinitionRequestDTO,
  ): Promise<ProcessDefinitionResponseDTO> {
    const response = await this.post<ProcessDefinitionResponseDTO>(
      `/api/v1/projects/${encodePathSegment(projectId)}/process-definitions`,
      processDefinition,
    );
    return response.data;
  }

  async updateProcessDefinition(
    processId: string,
    processDefinition: ProcessDefinitionRequestDTO,
  ): Promise<ProcessDefinitionResponseDTO> {
    const response = await this.put<ProcessDefinitionResponseDTO>(
      `/api/v1/projects/process-definitions/${encodePathSegment(processId)}`,
      processDefinition,
    );
    return response.data;
  }

  async saveDiagramProcessDefinition(
    processKey: string,
    processDefinition: BpmDiagramDTO,
  ): Promise<ProcessDefinitionResponseDTO> {
    const response = await this.put<ProcessDefinitionResponseDTO>(
      `/api/v1/projects/process-definitions/${encodePathSegment(processKey)}/diagram`,
      processDefinition,
    );
    return response.data;
  }

  async deployProcessDefinition(
    processKey: string,
    processDefinition: BpmDiagramDTO,
  ): Promise<ProcessDefinitionResponseDTO> {
    const response = await this.post<ProcessDefinitionResponseDTO>(
      `/api/v1/projects/process-definitions/${encodePathSegment(processKey)}/deploy`,
      processDefinition,
    );
    return response.data;
  }

  async addVariablesToProcess(
    processId: string,
    variables: ProcessVariableRequestDTO[],
  ): Promise<ProcessVariableResponseDTO> {
    const response = await this.post<ProcessVariableResponseDTO>(
      `/api/v1/projects/process-definitions/${encodePathSegment(processId)}/variables`,
      variables,
    );
    return response.data;
  }

  /** @deprecated Use addVariablesToProcess. */
  async createOrUpdateVariable(
    processId: string,
    variables: ProcessVariableRequestDTO[],
  ): Promise<ProcessVariableResponseDTO> {
    return this.addVariablesToProcess(processId, variables);
  }

  async getVariables(processId: string): Promise<ProcessVariableResponseDTO> {
    const response = await this.get<ProcessVariableResponseDTO>(
      `/api/v1/projects/process-definitions/${encodePathSegment(processId)}/variables`,
    );
    return response.data;
  }

  async deleteProcessDefinition(processId: string): Promise<string> {
    const response = await this.patch<string>(
      `/api/v1/projects/process-definitions/${encodePathSegment(processId)}/delete`,
    );
    return response.data;
  }

  async restoreProcessDefinition(processId: string): Promise<string> {
    const response = await this.patch<string>(
      `/api/v1/projects/process-definitions/${encodePathSegment(processId)}/restore`,
    );
    return response.data;
  }

  async getProcessDefinitionState(): Promise<EnumItemString[]> {
    const response = await this.get<EnumItemString[]>('/parameterization/process-definition-state');
    return response.data;
  }

  async listM2mKeys(): Promise<M2mKeySummaryDTO[]> {
    const response = await this.get<M2mKeySummaryDTO[]>('/m2m-keys');
    return response.data;
  }

  async createM2mKey(request: M2mKeyRequestDTO): Promise<M2mKeyCreatedDTO> {
    const response = await this.post<M2mKeyCreatedDTO>('/m2m-keys', request);
    return response.data;
  }

  async rotateM2mKey(id: string): Promise<M2mKeyCreatedDTO> {
    const response = await this.post<M2mKeyCreatedDTO>(`/m2m-keys/${encodePathSegment(id)}/rotate`);
    return response.data;
  }

  async revokeM2mKey(id: string): Promise<void> {
    await this.delete(`/m2m-keys/${encodePathSegment(id)}`);
  }

  async listEmailAccessMappings(): Promise<EmailAccessMappingDTO[]> {
    const response = await this.get<EmailAccessMappingDTO[]>('/email-access-mappings');
    return response.data;
  }

  async createEmailAccessMapping(
    request: EmailAccessMappingRequestDTO,
  ): Promise<EmailAccessMappingDTO> {
    const response = await this.post<EmailAccessMappingDTO>('/email-access-mappings', request);
    return response.data;
  }

  async updateEmailAccessMapping(
    id: string,
    request: EmailAccessMappingRequestDTO,
  ): Promise<EmailAccessMappingDTO> {
    const response = await this.put<EmailAccessMappingDTO>(
      `/email-access-mappings/${encodePathSegment(id)}`,
      request,
    );
    return response.data;
  }

  async revokeEmailAccessMapping(id: string): Promise<void> {
    await this.delete(`/email-access-mappings/${encodePathSegment(id)}`);
  }
}
