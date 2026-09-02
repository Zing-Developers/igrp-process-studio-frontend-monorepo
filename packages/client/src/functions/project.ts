import type { Project, PaginatedResponse } from '@igrp/framework-process-studio-types';
import { ProcessStudioApiClient } from '../utils/process-studio-api-client';

export const createProjectFunctions = (apiClient: ProcessStudioApiClient) => {
  return {
    getProject: async (): Promise<PaginatedResponse<Project>> => {
      return apiClient.getProjects();
    },

    getProjectById: async (code: string): Promise<Project> => {
      return apiClient.getProjectById(code);
    },

    createOrUpdateProject: async (project: Project): Promise<Project> => {
      if (project.projectId) {
        return apiClient.updateProject(project);
      } else {
        return apiClient.createProject(project);
      }
    },

    createProject: async (project: Project): Promise<Project> => {
      return apiClient.createProject(project);
    },

    updateProject: async (project: Project): Promise<Project> => {
      return apiClient.updateProject(project);
    },

    deleteProject: async (code: string): Promise<any> => {
      return apiClient.deleteProject(code);
    },
  };
};
