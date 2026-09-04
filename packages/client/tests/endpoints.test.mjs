import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ApiClientError,
  ProcessStudioApiClient,
  createProcessStudioClient,
} from '../dist/index.js';

const jsonResponse = (body = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

const endpointCases = [
  {
    name: 'get project',
    method: 'GET',
    path: '/api/v1/projects/project%2Fid',
    invoke: (client) => client.getProjectById('project/id'),
  },
  {
    name: 'update project',
    method: 'PUT',
    path: '/api/v1/projects/project-id',
    body: { name: 'Project' },
    invoke: (client) => client.updateProject('project-id', { name: 'Project' }),
  },
  {
    name: 'save diagram',
    method: 'PUT',
    path: '/api/v1/projects/process-definitions/process-key/diagram',
    body: { content: '<xml />' },
    invoke: (client) => client.saveDiagramProcessDefinition('process-key', { content: '<xml />' }),
  },
  {
    name: 'get process definition',
    method: 'GET',
    path: '/api/v1/projects/process-definitions/process-id',
    invoke: (client) => client.getProcessDefinitionById('process-id'),
  },
  {
    name: 'update process definition',
    method: 'PUT',
    path: '/api/v1/projects/process-definitions/process-id',
    body: { title: 'Process' },
    invoke: (client) => client.updateProcessDefinition('process-id', { title: 'Process' }),
  },
  {
    name: 'list m2m keys',
    method: 'GET',
    path: '/m2m-keys',
    invoke: (client) => client.listM2mKeys(),
  },
  {
    name: 'create m2m key',
    method: 'POST',
    path: '/m2m-keys',
    body: { clientName: 'client' },
    invoke: (client) => client.createM2mKey({ clientName: 'client' }),
  },
  {
    name: 'rotate m2m key',
    method: 'POST',
    path: '/m2m-keys/key-id/rotate',
    invoke: (client) => client.rotateM2mKey('key-id'),
  },
  {
    name: 'list projects',
    method: 'GET',
    path: '/api/v1/projects?appCode=app+code&pageNumber=0&pageSize=20',
    invoke: (client) =>
      client.getProjects({ appCode: 'app code', pageNumber: '0', pageSize: '20' }),
  },
  {
    name: 'create project',
    method: 'POST',
    path: '/api/v1/projects',
    body: { code: 'PRJ' },
    invoke: (client) => client.createProject({ code: 'PRJ' }),
  },
  {
    name: 'create process definition',
    method: 'POST',
    path: '/api/v1/projects/project-id/process-definitions',
    body: { processKey: 'process-key' },
    invoke: (client) => client.createProcessDefinition('project-id', { processKey: 'process-key' }),
  },
  {
    name: 'deploy process definition',
    method: 'POST',
    path: '/api/v1/projects/process-definitions/process-key/deploy',
    body: { content: '<xml />' },
    invoke: (client) => client.deployProcessDefinition('process-key', { content: '<xml />' }),
  },
  {
    name: 'get process variables',
    method: 'GET',
    path: '/api/v1/projects/process-definitions/process-id/variables',
    invoke: (client) => client.getVariables('process-id'),
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
    name: 'enable project',
    method: 'PATCH',
    path: '/api/v1/projects/project-id/enable',
    response: () => new Response('enabled', { status: 200 }),
    invoke: (client) => client.enableProject('project-id'),
  },
  {
    name: 'disable project',
    method: 'PATCH',
    path: '/api/v1/projects/project-id/disable',
    response: () => new Response('disabled', { status: 200 }),
    invoke: (client) => client.disableProject('project-id'),
  },
  {
    name: 'restore process definition',
    method: 'PATCH',
    path: '/api/v1/projects/process-definitions/process-id/restore',
    response: () => new Response('restored', { status: 200 }),
    invoke: (client) => client.restoreProcessDefinition('process-id'),
  },
  {
    name: 'delete process definition',
    method: 'PATCH',
    path: '/api/v1/projects/process-definitions/process-id/delete',
    response: () => new Response('deleted', { status: 200 }),
    invoke: (client) => client.deleteProcessDefinition('process-id'),
  },
  {
    name: 'get process definition states',
    method: 'GET',
    path: '/parameterization/process-definition-state',
    response: () =>
      new Response(JSON.stringify([{ value: 'DRAFT', label: 'Draft' }]), {
        status: 200,
        headers: { 'content-type': 'application/hal+json' },
      }),
    invoke: (client) => client.getProcessDefinitionState(),
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
    invoke: (client) => client.getDeployedProcessByProjectId('project-id', { processKey: 'key' }),
  },
  {
    name: 'list process definitions',
    method: 'GET',
    path: '/api/v1/projects/process-definitions?appCode=app&state=DRAFT',
    invoke: (client) => client.getProcessDefinitions({ appCode: 'app', state: 'DRAFT' }),
  },
  {
    name: 'revoke m2m key',
    method: 'DELETE',
    path: '/m2m-keys/key-id',
    response: () => new Response(null, { status: 200 }),
    invoke: (client) => client.revokeM2mKey('key-id'),
  },
];

for (const endpointCase of endpointCases) {
  test(`${endpointCase.method} ${endpointCase.name}`, async () => {
    let request;
    globalThis.fetch = async (url, options) => {
      request = { url, options };
      return endpointCase.response?.() ?? jsonResponse();
    };

    const client = new ProcessStudioApiClient({ baseUrl: 'https://example.test/root/' });
    await endpointCase.invoke(client);

    assert.equal(request.url, `https://example.test/root${endpointCase.path}`);
    assert.equal(request.options.method, endpointCase.method);
    assert.deepEqual(
      request.options.body === undefined ? undefined : JSON.parse(request.options.body),
      endpointCase.body,
    );
  });
}

test('does not append a question mark for an empty filter', async () => {
  let requestUrl;
  globalThis.fetch = async (url) => {
    requestUrl = url;
    return jsonResponse({ content: [] });
  };

  await new ProcessStudioApiClient({ baseUrl: 'https://example.test' }).getProjects({});
  assert.equal(requestUrl, 'https://example.test/api/v1/projects');
});

test('adds bearer authentication and accepts JSON and HAL+JSON', async () => {
  let requestHeaders;
  globalThis.fetch = async (_url, options) => {
    requestHeaders = options.headers;
    return jsonResponse({ content: [] });
  };

  const client = createProcessStudioClient({
    baseUrl: 'https://example.test',
    apiKey: 'secret-key',
  });
  await client.projects.getAll();

  assert.equal(requestHeaders.Authorization, 'Bearer secret-key');
  assert.equal(requestHeaders.Accept, 'application/json, application/hal+json');
});

test('explicit authorization header overrides apiKey', async () => {
  let requestHeaders;
  globalThis.fetch = async (_url, options) => {
    requestHeaders = options.headers;
    return jsonResponse({ content: [] });
  };

  const client = createProcessStudioClient({
    baseUrl: 'https://example.test',
    apiKey: 'ignored-key',
    headers: { Authorization: 'Bearer explicit-token' },
  });
  await client.projects.getAll();

  assert.equal(requestHeaders.Authorization, 'Bearer explicit-token');
});

test('returns undefined for a 204 response', async () => {
  globalThis.fetch = async () => new Response(null, { status: 204 });
  const client = new ProcessStudioApiClient({ baseUrl: 'https://example.test' });
  assert.equal(await client.revokeM2mKey('key-id'), undefined);
});

test('throws ApiClientError with the parsed response details', async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ code: 'invalid_request' }), {
      status: 400,
      statusText: 'Bad Request',
      headers: { 'content-type': 'application/json' },
    });

  const client = new ProcessStudioApiClient({ baseUrl: 'https://example.test' });
  await assert.rejects(client.getProjects(), (error) => {
    assert.ok(error instanceof ApiClientError);
    assert.equal(error.status, 400);
    assert.deepEqual(error.details, { code: 'invalid_request' });
    return true;
  });
});
