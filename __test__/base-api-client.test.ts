import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ApiClientError,
  BaseApiClient,
} from '../packages/client/src/utils/base-api-client';

class TestApiClient extends BaseApiClient {
  get config() {
    return {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
      defaultHeaders: this.defaultHeaders,
    };
  }

  testGet<T>(endpoint: string, params?: object) {
    return this.get<T>(endpoint, params);
  }

  testPost<T>(endpoint: string, body?: unknown, params?: object) {
    return this.post<T>(endpoint, body, params);
  }

  testPut<T>(endpoint: string, body?: unknown) {
    return this.put<T>(endpoint, body);
  }

  testPatch<T>(endpoint: string, body?: unknown) {
    return this.patch<T>(endpoint, body);
  }

  testDelete<T>(endpoint: string, body?: unknown) {
    return this.delete<T>(endpoint, body);
  }
}

const fetchMock = vi.fn();

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });

describe('BaseApiClient', () => {
  let client: TestApiClient;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', fetchMock);
    client = new TestApiClient({
      baseUrl: 'https://api.example.test/root/',
      timeout: 5_000,
      headers: { 'X-Application': 'studio' },
    });
    fetchMock.mockResolvedValue(jsonResponse({ id: 'result-id' }));
  });

  it('normalizes configuration and combines default headers', () => {
    expect(client.config).toEqual({
      baseUrl: 'https://api.example.test/root',
      timeout: 5_000,
      defaultHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json, application/hal+json',
        'X-Application': 'studio',
      },
    });
  });

  it('uses the default timeout when one is not supplied', () => {
    expect(new TestApiClient({ baseUrl: 'https://api.example.test' }).config.timeout).toBe(30_000);
  });

  it('builds a query string and omits empty values', async () => {
    await client.testGet('/projects', {
      appCode: 'my app',
      pageNumber: 0,
      pageSize: undefined,
      processKey: '',
      enabled: false,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/root/projects?appCode=my+app&pageNumber=0&enabled=false',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it.each([
    ['POST', (value: unknown) => client.testPost('/resource', value)],
    ['PUT', (value: unknown) => client.testPut('/resource', value)],
    ['PATCH', (value: unknown) => client.testPatch('/resource', value)],
    ['DELETE', (value: unknown) => client.testDelete('/resource', value)],
  ])('sends JSON bodies with %s', async (method, invoke) => {
    await invoke({ name: 'Example' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/root/resource',
      expect.objectContaining({
        method,
        body: JSON.stringify({ name: 'Example' }),
      }),
    );
  });

  it('returns response metadata and parsed JSON', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { id: 'project-id' },
        { status: 201, statusText: 'Created' },
      ),
    );

    await expect(client.testPost('/projects', {})).resolves.toEqual({
      data: { id: 'project-id' },
      status: 201,
      statusText: 'Created',
    });
  });

  it('parses plain text and empty 204 responses', async () => {
    fetchMock.mockResolvedValueOnce(new Response('enabled', { status: 200 }));
    await expect(client.testPatch<string>('/enable')).resolves.toMatchObject({ data: 'enabled' });

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    await expect(client.testDelete('/resource')).resolves.toEqual({
      data: undefined,
      status: 204,
      statusText: '',
    });
  });

  it('throws ApiClientError with parsed API details', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { code: 'invalid_request' },
        { status: 400, statusText: 'Bad Request' },
      ),
    );

    await expect(client.testGet('/projects')).rejects.toMatchObject({
      name: 'ApiClientError',
      message: 'HTTP Error: 400 Bad Request',
      status: 400,
      details: { code: 'invalid_request' },
    });
  });

  it('wraps network failures in ApiClientError', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network unavailable'));

    const request = client.testGet('/projects');
    await expect(request).rejects.toBeInstanceOf(ApiClientError);
    await expect(request).rejects.toMatchObject({
      message: 'Network unavailable',
      status: 0,
    });
  });
});
