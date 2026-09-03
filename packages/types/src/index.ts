export interface UserProfileDTO {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  sub?: string;
}

/** @deprecated Use UserProfileDTO. */
export type AuditUser = UserProfileDTO;

export interface ArtifactVariableResponseDTO {
  artifactVariableId?: string;
  key?: string;
  name?: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface ProcessArtifactResponseDTO {
  projectArtifactId?: string;
  taskKey?: string;
  name?: string;
  formKey?: string;
  subProcessId?: string;
  subProcessName?: string;
  artifactVariables?: ArtifactVariableResponseDTO[];
  subProcessTask?: boolean;
}

export type ProcessDefinitionStatus =
  | 'DRAFT'
  | 'VALIDATED'
  | 'PUBLISHED'
  | 'DEPRECATED'
  | 'ARCHIVED'
  | 'DISABLED'
  | 'ERROR'
  | 'DELETED';

export interface ProcessDefinitionRequestDTO {
  title?: string;
  processKey?: string;
  description?: string;
  projectId?: string;
  status?: ProcessDefinitionStatus;
}

export interface ProcessDefinitionResponseLightDTO {
  processDefinitionId?: string;
  projectId?: string;
  processKey?: string;
  bpmnDiagramUrl?: string;
  title?: string;
  description?: string;
  version?: number;
  status?: string;
  statusDesc?: string;
  deploymentId?: string;
  deploymentDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
  userProfileCreatedBy?: UserProfileDTO;
  userProfileLastModifiedBy?: UserProfileDTO;
}

export interface ProcessDefinitionResponseDTO extends ProcessDefinitionResponseLightDTO {
  bpmFileContent?: string;
  processArtifacts?: ProcessArtifactResponseDTO[];
}

/** @deprecated Use ProcessDefinitionResponseDTO. */
export type ProcessDefinition = ProcessDefinitionResponseDTO;

export interface ProjectRequestDTO {
  code?: string;
  name?: string;
  description?: string;
  appCode?: string;
}

export interface ProjectResponseDTO {
  projectId?: string;
  code?: string;
  name?: string;
  description?: string;
  active?: boolean;
  appCode?: string;
  createdBy?: string;
  lastModifiedBy?: string;
  userProfileCreatedBy?: UserProfileDTO;
  userProfileLastModifiedBy?: UserProfileDTO;
  processDefinitions?: ProcessDefinitionResponseDTO[];
}

/** @deprecated Use ProjectResponseDTO. */
export type Project = ProjectResponseDTO;

export interface PaginatedResponse<T> {
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
  first?: boolean;
  content?: T[];
}

export type WrapperListaProjectDTO = PaginatedResponse<ProjectResponseDTO>;
export type WrapperListaProcessDefinitionDTO = PaginatedResponse<ProcessDefinitionResponseLightDTO>;

export interface BpmDiagramDTO {
  content: string;
}

/** @deprecated Use BpmDiagramDTO. */
export type ProcessDefinitionContent = BpmDiagramDTO;

export interface ProjectFilter {
  appCode?: string;
  pageNumber?: string;
  pageSize?: string;
}

export interface ProcessDefinitionFilter {
  appCode?: string;
  processKey?: string;
  processName?: string;
  projectCode?: string;
  projectName?: string;
  state?: string;
  pageNumber?: string;
  pageSize?: string;
}

export interface ProjectProcessFilter {
  processName?: string;
  processKey?: string;
  pageSize?: string;
  pageNumber?: string;
}

export interface ProcessVariableRequestDTO {
  id?: string;
  name?: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface ProcessVariableResponseDTO extends ProcessVariableRequestDTO {
  processDefinitionId?: string;
}

/** @deprecated Use ProcessVariableRequestDTO. */
export type VariableDefinition = ProcessVariableRequestDTO;

export interface EnumItemString {
  value?: string;
  label?: string;
}

export interface CreateRequest {
  clientName?: string;
  permissions?: string[];
  email?: string;
  expiresAt?: string;
}

export interface CreatedResponse {
  id?: string;
  clientName?: string;
  key?: string;
  createdBy?: string;
  userProfileCreatedBy?: UserProfileDTO;
}

export interface KeySummary {
  id?: string;
  clientName?: string;
  keyPrefix?: string;
  permissions?: string;
  email?: string;
  active?: boolean;
  expiresAt?: string;
  createdAt?: string;
  createdBy?: string;
  userProfileCreatedBy?: UserProfileDTO;
  lastUsedAt?: string;
  revokedAt?: string;
  revokedBy?: string;
  userProfileRevokedBy?: UserProfileDTO;
}

export * from './process-studio';
