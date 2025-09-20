// Minimal API helper for NexusSheets
// - Uses /user and /character paths which are proxied in vite.config during dev
// - Stores token in localStorage under 'nexus_auth_token' by default

type Credentials = { credFieldOne: string; credFieldTwo: string };
type User = { username: string; password: string; email?: string };

const TOKEN_KEY = 'nexus_auth_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}

async function postJson(path: string, body: any, opts: { useCookies?: boolean } = {}) {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: opts.useCookies ? 'include' : 'same-origin',
  });
  const text = await res.text();
  let payload: any = text;
  try {
    payload = JSON.parse(text);
  } catch (e) {
    // ignore
  }
  if (!res.ok) throw new Error(typeof payload === 'string' ? payload : JSON.stringify(payload));
  return payload;
}

export async function login(creds: Credentials, useCookies = false) {
  // Backend expects JSON with fields credFieldOne and credFieldTwo
  const token = await postJson('/user/login', creds, { useCookies });
  if (!useCookies && typeof token === 'string') setToken(token);
  return token;
}

export async function register(user: User, useCookies = false) {
  // Backend expects a User object for register
  const token = await postJson('/user/register', user, { useCookies });
  if (!useCookies && typeof token === 'string') setToken(token);
  return token;
}

export function logoutLocal() {
  localStorage.removeItem(TOKEN_KEY);
}

// Character endpoints
export async function getCharacter(id: string) {
  const token = getToken();
  const url = `/character/${encodeURIComponent(id)}${token ? `?AuthToken=${encodeURIComponent(token)}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getCharactersForPlayer(player: string) {
  const token = getToken();
  const url = `/character/all?player=${encodeURIComponent(player)}${token ? `&AuthToken=${encodeURIComponent(token)}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createCharacter(body: any) {
  const token = getToken();
  const url = `/character/create${token ? `?AuthToken=${encodeURIComponent(token)}` : ''}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getUserInfo(username: string) {
  const token = getToken();
  const url = `/user/${encodeURIComponent(username)}${token ? `?AuthToken=${encodeURIComponent(token)}` : ''}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function logout(username: string) {
  const token = getToken();
  const url = `/user/logout/${encodeURIComponent(username)}${token ? `?AuthToken=${encodeURIComponent(token)}` : ''}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(await res.text());
  // clear local token
  logoutLocal();
  return res.text();
}

export async function getUserCharacters(username: string) {
  const token = getToken();
  const url = `/user/${encodeURIComponent(username)}/characters${token ? `?AuthToken=${encodeURIComponent(token)}` : ''}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addUserCharacter(username: string, characterId: string) {
  const token = getToken();
  const url = `/user/${encodeURIComponent(username)}/character?characterId=${encodeURIComponent(characterId)}${token ? `&AuthToken=${encodeURIComponent(token)}` : ''}`;
  const res = await fetch(url, { method: 'POST', credentials: 'include' });
  if (!res.ok) throw new Error(await res.text());
  return res.text();
}

export async function deleteUserCharacter(username: string, characterId: string) {
  const token = getToken();
  const url = `/user/${encodeURIComponent(username)}/character?characterId=${encodeURIComponent(characterId)}${token ? `&AuthToken=${encodeURIComponent(token)}` : ''}`;
  const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) throw new Error(await res.text());
  return res.text();
}

export default {
  login,
  register,
  logoutLocal,
  getCharacter,
  getCharactersForPlayer,
  createCharacter,
  getUserInfo,
  logout,
  getUserCharacters,
  addUserCharacter,
  deleteUserCharacter,
};
