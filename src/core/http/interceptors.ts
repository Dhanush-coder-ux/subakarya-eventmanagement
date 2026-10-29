export interface RequestInterceptor {
  (config: RequestInit): RequestInit | Promise<RequestInit>;
}

export interface ResponseInterceptor {
  (response: Response): Response | Promise<Response>;
}

export const defaultAuthInterceptor: RequestInterceptor = (config) => {
  const headers = new Headers(config.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('X-App-Client', 'Subakarya-Web');

  const token = localStorage.getItem('subakarya_auth_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return {
    ...config,
    headers,
  };
};
