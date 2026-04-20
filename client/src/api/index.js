export const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(url, options = {}) {
  const res = await fetch(API_BASE + '/api' + url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '请求失败');
  return data;
}

export function imageUrl(filename) {
  return `${API_BASE}/uploads/${filename}`;
}

export function login(password) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
}

export function fetchPosts(page = 1, limit = 10) {
  return request(`/posts?page=${page}&limit=${limit}`);
}

export function createPost(formData, token) {
  return request('/posts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
}

export function deletePost(id, token) {
  return request(`/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
