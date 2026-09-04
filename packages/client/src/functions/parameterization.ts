import type { EnumItemString } from '@irn/framework-process-studio-types';
import { ProcessStudioApiClient } from '../utils/process-studio-api-client.js';

export const createParameterizationFunctions = (apiClient: ProcessStudioApiClient) => ({
  getProcessDefinitionState: (): Promise<EnumItemString[]> => apiClient.getProcessDefinitionState(),
});
