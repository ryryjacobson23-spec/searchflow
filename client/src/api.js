const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const getDeals = () => request('/deals');

export const createDeal = (data) =>
  request('/deals', { method: 'POST', body: JSON.stringify(data) });

export const updateDeal = (id, data) =>
  request(`/deals/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteDeal = (id) =>
  request(`/deals/${id}`, { method: 'DELETE' });

export const addNote = (dealId, content) =>
  request(`/deals/${dealId}/notes`, { method: 'POST', body: JSON.stringify({ content }) });

export const deleteNote = (dealId, noteId) =>
  request(`/deals/${dealId}/notes/${noteId}`, { method: 'DELETE' });
