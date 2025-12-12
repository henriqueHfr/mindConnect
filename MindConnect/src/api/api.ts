const API_BASE = (global as any)?.API_BASE_URL ?? 'http://localhost:8080';

export async function apiPost(path: string, body: any): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data: any = await res.json().catch(() => ({}));
  return data;
}

export async function fetchWithAuth(input: RequestInfo, init: RequestInit | undefined, token: string | null, onUnauthorized?: () => void): Promise<any> {
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const finalInit: RequestInit = {
    ...init,
    headers: { ...(init?.headers || {}), ...headers },
  };

  const resp = await fetch(typeof input === 'string' ? `${API_BASE}${input}` : input, finalInit);
  if (resp.status === 401) {
    onUnauthorized?.();
    throw new Error('unauthorized');
  }
  const data: any = await resp.json().catch(() => ({}));
  return data;
}

export async function apiUpload(path: string, formData: FormData, token: string | null, onUnauthorized?: () => void): Promise<any> {
  const headers: any = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const resp = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers,
    body: formData as any,
  });

  if (resp.status === 401) {
    onUnauthorized?.();
    throw new Error('unauthorized');
  }

  const data: any = await resp.json().catch(() => ({}));
  return data;
}

export default { apiPost, fetchWithAuth, apiUpload };
