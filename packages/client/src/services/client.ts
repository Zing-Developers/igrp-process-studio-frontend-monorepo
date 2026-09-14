import { createEmailAccessMappingFunctions } from '../functions/email-access-mapping.js';
import { createProjectFunctions } from '../functions/project.js';
import { createProcessDefinitionFunctions } from '../functions/process-definition.js';
import { createM2mKeyFunctions } from '../functions/m2m-key.js';
import { createParameterizationFunctions } from '../functions/parameterization.js';
import type {
  ProcessStudioClient,
  ProcessStudioClientConfig,
} from '@irn/framework-process-studio-types';
import { ProcessStudioApiClient } from '../utils/process-studio-api-client.js';

const getEnvironmentBaseUrl = (): string =>
  typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_API_GATEWAY ?? '') : '';

export function createProcessStudioClient(config: ProcessStudioClientConfig): ProcessStudioClient {
  const apiClient = new ProcessStudioApiClient({
    baseUrl: config.baseUrl ?? getEnvironmentBaseUrl(),
    timeout: config.timeout ?? 30000,
    headers: {
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
      ...config.headers,
    },
  });
  const projectFunctions = createProjectFunctions(apiClient);
  const processDefinitionFunctions = createProcessDefinitionFunctions(apiClient);
  const parameterizationFunctions = createParameterizationFunctions(apiClient);
  const m2mKeyFunctions = createM2mKeyFunctions(apiClient);
  const emailAccessMappingFunctions = createEmailAccessMappingFunctions(apiClient);

  return {
    projects: {
      getAll: projectFunctions.getProject,
      getById: projectFunctions.getProjectById,
      create: projectFunctions.createProject,
      update: projectFunctions.updateProject,
      createOrUpdate: projectFunctions.createOrUpdateProject,
      enable: projectFunctions.enableProject,
      disable: projectFunctions.disableProject,
      getHistory: projectFunctions.getProcessHistoryByProjectId,
      getDeployed: projectFunctions.getDeployedProcessByProjectId,
    },
    processDefinitions: {
      getAll: async () => {
        const projects = await projectFunctions.getProject();
        return (projects.content ?? []).flatMap((project) => project.processDefinitions ?? []);
      },
      list: processDefinitionFunctions.getProcessDefinitions,
      getById: processDefinitionFunctions.getProcessDefinitionById,
      delete: processDefinitionFunctions.deleteProcessDefinition,
      restore: processDefinitionFunctions.restoreProcessDefinition,
      create: processDefinitionFunctions.createProcessDefinition,
      update: processDefinitionFunctions.updateProcessDefinition,
      createOrUpdate: processDefinitionFunctions.createOrUpdateProcessDefinition,
      saveDiagram: processDefinitionFunctions.saveDiagramProcessDefinition,
      deploy: processDefinitionFunctions.deployProcessDefinition,
      addVariables: processDefinitionFunctions.addVariablesToProcess,
      createOrUpdateVariable: processDefinitionFunctions.addVariablesToProcess,
      getVariables: processDefinitionFunctions.getVariables,
    },
    parameterization: parameterizationFunctions,
    m2mKeys: m2mKeyFunctions,
    emailAccessMappings: emailAccessMappingFunctions,
  };
}
