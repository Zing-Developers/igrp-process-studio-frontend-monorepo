import type {
  M2mKeyCreatedDTO,
  M2mKeyRequestDTO,
  M2mKeySummaryDTO,
} from '@irn/framework-process-studio-types';
import { ProcessStudioApiClient } from '../utils/process-studio-api-client.js';

export const createM2mKeyFunctions = (apiClient: ProcessStudioApiClient) => ({
  list: (): Promise<M2mKeySummaryDTO[]> => apiClient.listM2mKeys(),
  create: (request: M2mKeyRequestDTO): Promise<M2mKeyCreatedDTO> => apiClient.createM2mKey(request),
  rotate: (id: string): Promise<M2mKeyCreatedDTO> => apiClient.rotateM2mKey(id),
  revoke: (id: string): Promise<void> => apiClient.revokeM2mKey(id),
});
