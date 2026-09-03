import type {
  CreateRequest,
  CreatedResponse,
  KeySummary,
} from '@irn/framework-process-studio-types';
import { ProcessStudioApiClient } from '../utils/process-studio-api-client';

export const createM2mKeyFunctions = (apiClient: ProcessStudioApiClient) => ({
  list: (): Promise<KeySummary[]> => apiClient.listM2mKeys(),
  create: (request: CreateRequest): Promise<CreatedResponse> => apiClient.createM2mKey(request),
  rotate: (id: string): Promise<CreatedResponse> => apiClient.rotateM2mKey(id),
  revoke: (id: string): Promise<void> => apiClient.revokeM2mKey(id),
});
