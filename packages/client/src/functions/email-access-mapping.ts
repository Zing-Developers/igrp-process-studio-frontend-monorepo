import type {
  EmailAccessMappingDTO,
  EmailAccessMappingRequestDTO,
} from '@irn/framework-process-studio-types';
import { ProcessStudioApiClient } from '../utils/process-studio-api-client.js';

export const createEmailAccessMappingFunctions = (apiClient: ProcessStudioApiClient) => ({
  list: (): Promise<EmailAccessMappingDTO[]> => apiClient.listEmailAccessMappings(),
  create: (request: EmailAccessMappingRequestDTO): Promise<EmailAccessMappingDTO> =>
    apiClient.createEmailAccessMapping(request),
  update: (id: string, request: EmailAccessMappingRequestDTO): Promise<EmailAccessMappingDTO> =>
    apiClient.updateEmailAccessMapping(id, request),
  revoke: (id: string): Promise<void> => apiClient.revokeEmailAccessMapping(id),
});
