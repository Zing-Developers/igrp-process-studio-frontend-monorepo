import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createProcessStudioClient } from '../packages/client/src/services/client';

const fetchMock = vi.fn();

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

describe('createProcessStudioClient', () => {
  const originalGateway = process.env.NEXT_PUBLIC_API_GATEWAY;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockImplementation(async () => jsonResponse({}));
  });

  afterEach(() => {
    if (originalGateway === undefined) {
      delete process.env.NEXT_PUBLIC_API_GATEWAY;
    } else {
      process.env.NEXT_PUBLIC_API_GATEWAY = originalGateway;
    }
  });

  it('exposes every high-level SDK group', () => {
    const client = createProcessStudioClient({ baseUrl: 'https://api.example.test' });

    expect(client).toEqual(
      expect.objectContaining({
        projects: expect.any(Object),
        processDefinitions: expect.any(Object),
        parameterization: expect.any(Object),
        m2mKeys: expect.any(Object),
        emailAccessMappings: expect.any(Object),
      }),
    );
  });

  it('uses the environment gateway when baseUrl is omitted', async () => {
    process.env.NEXT_PUBLIC_API_GATEWAY = 'https://gateway.example.test';
    fetchMock.mockImplementation(async () => jsonResponse({ content: [] }));

    await createProcessStudioClient({}).projects.getAll();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://gateway.example.test/api/v1/projects',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('adds bearer authentication while allowing explicit header overrides', async () => {
    fetchMock.mockImplementation(async () => jsonResponse({ content: [] }));
    const client = createProcessStudioClient({
      baseUrl: 'https://api.example.test',
      apiKey: 'ignored-key',
      headers: {
        Authorization: 'Bearer explicit-token',
        'X-Tenant': 'tenant-id',
      },
    });

    await client.projects.getAll();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/api/v1/projects',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer explicit-token',
          'X-Tenant': 'tenant-id',
        }),
      }),
    );
  });

  it('flattens process definitions returned inside projects', async () => {
    fetchMock.mockImplementation(async () =>
      jsonResponse({
        content: [
          { projectId: 'one', processDefinitions: [{ processDefinitionId: 'first' }] },
          {
            projectId: 'two',
            processDefinitions: [
              { processDefinitionId: 'second' },
              { processDefinitionId: 'third' },
            ],
          },
          { projectId: 'three' },
        ],
      }),
    );

    await expect(
      createProcessStudioClient({ baseUrl: 'https://api.example.test' }).processDefinitions.getAll(),
    ).resolves.toEqual([
      { processDefinitionId: 'first' },
      { processDefinitionId: 'second' },
      { processDefinitionId: 'third' },
    ]);
  });

  it('routes createOrUpdate to the correct project operation', async () => {
    fetchMock.mockImplementation(async () => jsonResponse({ projectId: 'project-id' }));
    const client = createProcessStudioClient({ baseUrl: 'https://api.example.test' });

    await client.projects.createOrUpdate({ code: 'NEW' });
    await client.projects.createOrUpdate({ projectId: 'project/id', name: 'Updated' });

    expect(fetchMock.mock.calls.map(([url, options]) => [url, options.method])).toEqual([
      ['https://api.example.test/api/v1/projects', 'POST'],
      ['https://api.example.test/api/v1/projects/project%2Fid', 'PUT'],
    ]);
  });

  it('requires projectId when createOrUpdate creates a process definition', async () => {
    const client = createProcessStudioClient({ baseUrl: 'https://api.example.test' });

    expect(() =>
      client.processDefinitions.createOrUpdate({ processKey: 'invoice' }),
    ).toThrow('projectId is required to create a process definition');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
