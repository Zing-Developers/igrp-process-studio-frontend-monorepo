import type {
  BpmDiagramDTO,
  ProcessDefinitionFilter,
  ProcessDefinitionRequestDTO,
  ProcessDefinitionResponseDTO,
  ProcessVariableRequestDTO,
  ProcessVariableResponseDTO,
  WrapperListaProcessDefinitionDTO,
} from '@irn/framework-process-studio-types';
import { ProcessStudioApiClient } from '../utils/process-studio-api-client.js';

export const createProcessDefinitionFunctions = (apiClient: ProcessStudioApiClient) => ({
  getProcessDefinitions: (
    filter?: ProcessDefinitionFilter,
  ): Promise<WrapperListaProcessDefinitionDTO> => apiClient.getProcessDefinitions(filter),

  getProcessDefinitionById: (processId: string): Promise<ProcessDefinitionResponseDTO> =>
    apiClient.getProcessDefinitionById(processId),

  deleteProcessDefinition: (processId: string): Promise<string> =>
    apiClient.deleteProcessDefinition(processId),

  restoreProcessDefinition: (processId: string): Promise<string> =>
    apiClient.restoreProcessDefinition(processId),

  createProcessDefinition: (
    projectId: string,
    processDefinition: ProcessDefinitionRequestDTO,
  ): Promise<ProcessDefinitionResponseDTO> =>
    apiClient.createProcessDefinition(projectId, processDefinition),

  updateProcessDefinition: (
    processId: string,
    processDefinition: ProcessDefinitionRequestDTO,
  ): Promise<ProcessDefinitionResponseDTO> =>
    apiClient.updateProcessDefinition(processId, processDefinition),

  createOrUpdateProcessDefinition: (
    processDefinition: ProcessDefinitionRequestDTO & { processDefinitionId?: string },
  ): Promise<ProcessDefinitionResponseDTO> => {
    const { processDefinitionId, ...request } = processDefinition;
    if (processDefinitionId) {
      return apiClient.updateProcessDefinition(processDefinitionId, request);
    }
    if (!request.projectId) {
      throw new TypeError('projectId is required to create a process definition');
    }
    return apiClient.createProcessDefinition(request.projectId, request);
  },

  saveDiagramProcessDefinition: (
    processKey: string,
    processDefinition: BpmDiagramDTO,
  ): Promise<ProcessDefinitionResponseDTO> =>
    apiClient.saveDiagramProcessDefinition(processKey, processDefinition),

  deployProcessDefinition: (
    processKey: string,
    processDefinition: BpmDiagramDTO,
  ): Promise<ProcessDefinitionResponseDTO> =>
    apiClient.deployProcessDefinition(processKey, processDefinition),

  addVariablesToProcess: (
    processId: string,
    variables: ProcessVariableRequestDTO[],
  ): Promise<ProcessVariableResponseDTO> => apiClient.addVariablesToProcess(processId, variables),

  getVariables: (processId: string): Promise<ProcessVariableResponseDTO> =>
    apiClient.getVariables(processId),
});
