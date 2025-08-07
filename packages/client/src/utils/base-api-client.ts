import { ApiClientConfig, ApiResponse, UploadFileOptions, UserFilters } from './types';

export class BaseApiClient {
  protected baseUrl: string;
  protected timeout: number;
  protected defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = config.timeout || 30000; // 30 seconds default
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...config.headers,
    };
  }

  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    };

    try {
      console.log({
        url,
        requestOptions,
      });
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await this.parseResponse<T>(response);

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiClientError) {
        throw error;
      }

      throw new ApiClientError({
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 0,
        details: error,
      });
    }
  }

  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${this.buildQueryString(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  protected async post<T>(
    endpoint: string,
    body?: any,
    params?: {
      params: UserFilters | UploadFileOptions | undefined;
      headers?: Record<string, string>;
    },
  ): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${this.buildQueryString(params)}` : endpoint;
    return this.request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: params?.headers,
    });
  }

  protected async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  protected async delete<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    // For non-JSON responses, return the text content
    const text = await response.text();
    return text as unknown as T;
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorDetails: any;

    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorDetails = await response.json();
      } else {
        errorDetails = await response.text();
      }
    } catch {
      errorDetails = null;
    }

    throw new ApiClientError({
      message: `HTTP Error: ${response.status} ${response.statusText}`,
      status: response.status,
      details: errorDetails,
    });
  }

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }
}

export class ApiClientError extends Error {
  public status: number;
  public details?: any;

  constructor(params: { message: string; status: number; details?: any }) {
    super(params.message);
    this.name = 'ApiClientError';
    this.status = params.status;
    this.details = params.details;

    // Required to fix prototype chain issues when extending built-ins
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}
