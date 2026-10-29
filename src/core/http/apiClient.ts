import { env } from '../config/env';
import { handleApiError, ApiError } from './apiErrorHandler';
import { defaultAuthInterceptor, RequestInterceptor } from './interceptors';

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
  ok: boolean;
}

export class ApiClient {
  private baseUrl: string;
  private requestInterceptors: RequestInterceptor[] = [defaultAuthInterceptor];

  constructor(baseUrl: string = env.apiUrl) {
    this.baseUrl = baseUrl;
  }

  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  private async execute<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    let config = { ...options };

    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return {
          data: null,
          error: {
            message: errorData?.message || `Request failed with status ${response.status}`,
            statusCode: response.status,
          },
          status: response.status,
          ok: false,
        };
      }

      const data = await response.json();
      return {
        data,
        error: null,
        status: response.status,
        ok: true,
      };
    } catch (err) {
      return {
        data: null,
        error: handleApiError(err),
        status: 0,
        ok: false,
      };
    }
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.execute<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.execute<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.execute<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.execute<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

