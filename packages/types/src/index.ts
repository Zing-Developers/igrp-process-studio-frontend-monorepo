export interface AuditUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  sub: string;
}

export type Project = {
  code: string;
  name: string;
  description: string;
  projectId: string;
  processDefinitions: ProcessDefinition[];
  createdBy?: AuditUser;
  createdDate?: string;
  lastModifiedBy?: AuditUser;
  lastModifiedDate?: string;
};

export interface PaginatedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: T[];
}

export interface ProcessDefinition {
  title: string;
  description: string;
  projectId: string;
  status: string;
  processDefinitionId: string;
  version: string;
  statusDesc: string;
  bpmFileContent: string;
  processKey: string;
  bpmnDiagramUrl?: string;
  deploymentId?: string;
  /**
   * Either an ISO string, a Java `LocalDateTime` array `[y, m, d, h, m, s, ns]`,
   * or a pre-formatted display string — depends on backend serialization config.
   * Use `formatDeploymentDate` (from `@igrp/framework-process-studio-client`) to
   * normalize for display.
   */
  deploymentDate?: string | number[];
  createdBy?: AuditUser;
  createdDate?: string;
  lastModifiedBy?: AuditUser;
  lastModifiedDate?: string;
}

export interface ProcessDefinitionContent {
  content: string;
}

export interface ProcessDefinitionFilter {
  appCode?: string;
  processKey?: string;
  processName?: string;
  projectCode?: string;
  projectName?: string;
  state?: string;
  pageNumber?: string | number;
  pageSize?: string | number;
}

export interface VariableDefinition {
  id: string;
  name: string;
  type: string;
  defaultValue: string;
  required: boolean;
}

// Process Studio Client Types
export * from './process-studio';
