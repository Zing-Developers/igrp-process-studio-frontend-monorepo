import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProcessStudioApiClient } from '../packages/client/src/utils/process-studio-api-client';

const fetchMock = vi.fn();

const jsonResponse = (body: unknown = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

interface EndpointCase {
  name: string;
  method: string;
  path: string;
  body?: unknown;
  invoke: (client: ProcessStudioApiClient) => Promise<unknown>;
}

const endpointCases: EndpointCase[] = [
  {
    name: 'list projects with filters',
    method: 'GET',
    path: '/api/v1/projects?appCode=studio+app&pageNumber=0&pageSize=20',
    invoke: (client) =>
      client.getProjects({ appCode: 'studio app', pageNumber: '0', pageSize: '20' }),
  },
  {
    name: 'get a project with an encoded ID',
    method: 'GET',
    path: '/api/v1/projects/project%2Fid',
    invoke: (client) => client.getProjectById('project/id'),
  },
  {
    name: 'create a project',
    method: 'POST',
    path: '/api/v1/projects',
    body: { code: 'PRJ', name: 'Project' },
    invoke: (client) => client.createProject({ code: 'PRJ', name: 'Project' }),
  },
  {
    name: 'update a project',
    method: 'PUT',
    path: '/api/v1/projects/project-id',
    body: { name: 'Updated' },
    invoke: (client) => client.updateProject('project-id', { name: 'Updated' }),
  },
  {
    name: 'enable a project',
    method: 'PATCH',
    path: '/api/v1/projects/project-id/enable',
    invoke: (client) => client.enableProject('project-id'),
  },
  {
    name: 'disable a project',
    method: 'PATCH',
    path: '/api/v1/projects/project-id/disable',
    invoke: (client) => client.disableProject('project-id'),
  },
  {
    name: 'get project process history',
    method: 'GET',
    path: '/api/v1/projects/project-id/history-process?processName=My+process&pageNumber=1',
    invoke: (client) =>
      client.getProcessHistoryByProjectId('project-id', {
        processName: 'My process',
        pageNumber: '1',
      }),
  },
  {
    name: 'get deployed project processes',
    method: 'GET',
    path: '/api/v1/projects/project-id/deployed-process?processKey=key',
    invoke: (client) =>
      client.getDeployedProcessByProjectId('project-id', { processKey: 'key' }),
  },
  {
    name: 'list process definitions',
    method: 'GET',
    path: '/api/v1/projects/process-definitions?appCode=app&state=DRAFT',
    invoke: (client) => client.getProcessDefinitions({ appCode: 'app', state: 'DRAFT' }),
  },
  {
    name: 'get a process definition',
    method: 'GET',
    path: '/api/v1/projects/process-definitions/process%2Fid',
    invoke: (client) => client.getProcessDefinitionById('process/id'),
  },
  {
    name: 'create a process definition',
    method: 'POST',
    path: '/api/v1/projects/project-id/process-definitions',
    body: { processKey: 'invoice' },
    invoke: (client) =>
      client.createProcessDefinition('project-id', { processKey: 'invoice' }),
  },
  {
    name: 'update a process definition',
    method: 'PUT',
    path: '/api/v1/projects/process-definitions/process-id',
    body: { title: 'Invoice approval' },
    invoke: (client) =>
      client.updateProcessDefinition('process-id', { title: 'Invoice approval' }),
  },
  {
    name: 'save a BPMN diagram',
    method: 'PUT',
    path: '/api/v1/projects/process-definitions/invoice/diagram',
    body: { content: '<xml />' },
    invoke: (client) =>
      client.saveDiagramProcessDefinition('invoice', { content: '<xml />' }),
  },
  {
    name: 'deploy a process definition',
    method: 'POST',
    path: '/api/v1/projects/process-definitions/invoice/deploy',
    body: { content: '<xml />' },
    invoke: (client) => client.deployProcessDefinition('invoice', { content: '<xml />' }),
  },
  {
    name: 'add process variables',
    method: 'POST',
    path: '/api/v1/projects/process-definitions/process-id/variables',
    body: [{ name: 'amount', type: 'number' }],
    invoke: (client) =>
      client.addVariablesToProcess('process-id', [{ name: 'amount', type: 'number' }]),
  },
  {
    name: 'get process variables',
    method: 'GET',
    path: '/api/v1/projects/process-definitions/process-id/variables',
    invoke: (client) => client.getVariables('process-id'),
  },
  {
    name: 'soft-delete a process definition',
    method: 'PATCH',
    path: '/api/v1/projects/process-definitions/process-id/delete',
    invoke: (client) => client.deleteProcessDefinition('process-id'),
  },
  {
    name: 'restore a process definition',
    method: 'PATCH',
    path: '/api/v1/projects/process-definitions/process-id/restore',
    invoke: (client) => client.restoreProcessDefinition('process-id'),
  },
  {
    name: 'get process definition states',
    method: 'GET',
    path: '/parameterization/process-definition-state',
    invoke: (client) => client.getProcessDefinitionState(),
  },
  {
    name: 'list M2M keys',
    method: 'GET',
    path: '/m2m-keys',
    invoke: (client) => client.listM2mKeys(),
  },
  {
    name: 'create an M2M key',
    method: 'POST',
    path: '/m2m-keys',
    body: { clientName: 'deployment-agent' },
    invoke: (client) => client.createM2mKey({ clientName: 'deployment-agent' }),
  },
  {
    name: 'rotate an encoded M2M key ID',
    method: 'POST',
    path: '/m2m-keys/key%2Fid/rotate',
    invoke: (client) => client.rotateM2mKey('key/id'),
  },
  {
    name: 'revoke an M2M key',
    method: 'DELETE',
    path: '/m2m-keys/key-id',
    invoke: (client) => client.revokeM2mKey('key-id'),
  },
  {
    name: 'list email access mappings',
    method: 'GET',
    path: '/email-access-mappings',
    invoke: (client) => client.listEmailAccessMappings(),
  },
  {
    name: 'create an email access mapping',
    method: 'POST',
    path: '/email-access-mappings',
    body: { email: 'user@example.test', permissions: ['PROJECT:read'] },
    invoke: (client) =>
      client.createEmailAccessMapping({
        email: 'user@example.test',
        permissions: ['PROJECT:read'],
      }),
  },
  {
    name: 'update an encoded email access mapping ID',
    method: 'PUT',
    path: '/email-access-mappings/mapping%2Fid',
    body: { notes: 'updated' },
    invoke: (client) => client.updateEmailAccessMapping('mapping/id', { notes: 'updated' }),
  },
  {
    name: 'revoke an email access mapping',
    method: 'DELETE',
    path: '/email-access-mappings/mapping-id',
    invoke: (client) => client.revokeEmailAccessMapping('mapping-id'),
  },
];

describe('ProcessStudioApiClient endpoint contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockResolvedValue(jsonResponse());
  });

  it.each(endpointCases)('$method $name', async ({ method, path, body, invoke }) => {
    const client = new ProcessStudioApiClient({ baseUrl: 'https://api.example.test/root/' });
    await invoke(client);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`https://api.example.test/root${path}`);
    expect(options.method).toBe(method);
    expect(options.body).toBe(body === undefined ? undefined : JSON.stringify(body));
  });
});
