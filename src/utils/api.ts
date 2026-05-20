export interface ApiClientOptions {
  baseURL: string;
  token?: string;
}

export interface ApiClient {
  get<T = any>(path: string): Promise<T>;
  post<T = any>(path: string, body?: any): Promise<T>;
  put<T = any>(path: string, body?: any): Promise<T>;
  delete<T = any>(path: string): Promise<T>;
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  const { baseURL, token } = options;

  async function request<T>(method: string, path: string, body?: any): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${baseURL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.error?.message || `HTTP ${res.status}`);
    }

    return json;
  }

  return {
    get: <T>(path: string) => request<T>('GET', path),
    post: <T>(path: string, body?: any) => request<T>('POST', path, body),
    put: <T>(path: string, body?: any) => request<T>('PUT', path, body),
    delete: <T>(path: string) => request<T>('DELETE', path),
  };
}
