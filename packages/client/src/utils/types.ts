export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}
