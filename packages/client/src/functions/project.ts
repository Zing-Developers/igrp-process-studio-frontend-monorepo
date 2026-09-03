import type {
  ProjectFilter,
  ProjectProcessFilter,
  ProjectRequestDTO,
  ProjectResponseDTO,
  WrapperListaProjectDTO,
} from '@irn/framework-process-studio-types';
import { ProcessStudioApiClient } from '../utils/process-studio-api-client';

export const createProjectFunctions = (apiClient: ProcessStudioApiClient) => ({
  getProject: (filter?: ProjectFilter): Promise<WrapperListaProjectDTO> =>
    apiClient.getProjects(filter),

  getProjectById: (projectId: string): Promise<ProjectResponseDTO> =>
    apiClient.getProjectById(projectId),

  createProject: (project: ProjectRequestDTO): Promise<ProjectResponseDTO> =>
    apiClient.createProject(project),

  updateProject: (projectId: string, project: ProjectRequestDTO): Promise<ProjectResponseDTO> =>
    apiClient.updateProject(projectId, project),

  createOrUpdateProject: (
    project: ProjectRequestDTO & { projectId?: string },
  ): Promise<ProjectResponseDTO> => {
    const { projectId, ...request } = project;
    return projectId
      ? apiClient.updateProject(projectId, request)
      : apiClient.createProject(request);
  },

  enableProject: (projectId: string): Promise<string> => apiClient.enableProject(projectId),

  disableProject: (projectId: string): Promise<string> => apiClient.disableProject(projectId),

  getProcessHistoryByProjectId: (
    projectId: string,
    filter?: ProjectProcessFilter,
  ): Promise<ProjectResponseDTO> => apiClient.getProcessHistoryByProjectId(projectId, filter),

  getDeployedProcessByProjectId: (
    projectId: string,
    filter?: ProjectProcessFilter,
  ): Promise<ProjectResponseDTO> => apiClient.getDeployedProcessByProjectId(projectId, filter),
});
