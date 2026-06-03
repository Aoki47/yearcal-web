const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getAuthHeader(): Record<string, string> {
  const credentials = sessionStorage.getItem('yearcal_credentials');
  if (!credentials) return {};
  return { Authorization: `Basic ${credentials}` };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    sessionStorage.removeItem('yearcal_credentials');
    window.location.reload();
    throw new Error('Unauthorized');
  }

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  getEvents: (year: number) =>
    request<import('../types').CalEvent[]>(`/events?year=${year}`),

  createEvent: (data: Omit<import('../types').CalEvent, 'id' | 'created_at' | 'updated_at'>) =>
    request<import('../types').CalEvent>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateEvent: (id: string, data: Partial<Omit<import('../types').CalEvent, 'id' | 'created_at' | 'updated_at'>>) =>
    request<import('../types').CalEvent>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteEvent: (id: string) =>
    request<void>(`/events/${id}`, { method: 'DELETE' }),

  testAuth: (credentials: string) =>
    fetch(`${API_BASE}/events?year=2000`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
    }).then(res => res.status !== 401),
};
