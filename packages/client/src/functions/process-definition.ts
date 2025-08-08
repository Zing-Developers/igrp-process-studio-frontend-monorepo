import type {
  ProcessDefinition,
  ProcessDefinitionContent,
} from '@igrp/framework-process-studio-types';
import { ProcessStudioApiClient } from '../utils/process-studio-api-client';

export const createProcessDefinitionFunctions = (apiClient: ProcessStudioApiClient) => {
  return {
    getProcessDefinitionById: async (processDefinitionId: string): Promise<ProcessDefinition> => {
      return apiClient.getProcessDefinitionById(processDefinitionId);
    },

    createProcessDefinition: async (
      projectId: string,
      processDefinition: ProcessDefinition,
    ): Promise<ProcessDefinition> => {
      return apiClient.createProcessDefinition(projectId, processDefinition);
    },

    updateProcessDefinition: async (
      projectId: string,
      processDefinition: ProcessDefinition,
    ): Promise<ProcessDefinition> => {
      return apiClient.updateProcessDefinition(projectId, processDefinition);
    },

    createOrUpdateProcessDefinition: async (
      processDefinition: ProcessDefinition,
    ): Promise<ProcessDefinition> => {
      if (processDefinition.processDefinitionId) {
        return apiClient.updateProcessDefinition(processDefinition.projectId, processDefinition);
      } else {
        return apiClient.createProcessDefinition(processDefinition.projectId, processDefinition);
      }
    },

    saveDiagramProcessDefinition: async (
      processDefinitionId: string,
      processDefinition: ProcessDefinitionContent,
    ): Promise<any> => {
      return apiClient.saveDiagramProcessDefinition(processDefinitionId, processDefinition);
    },

    deployProcessDefinition: async (
      processDefinitionId: string,
      processDefinition: ProcessDefinitionContent,
    ): Promise<any> => {
      return apiClient.deployProcessDefinition(processDefinitionId, processDefinition);
    },
  };
};
