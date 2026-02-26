// Base URL:
//   Dev  → '' (empty) — Vite proxy forwards /api/* to localhost:8080
//   Prod → VITE_API_URL from Vercel environment variables
const BASE_URL = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try {
      const body = await response.json()
      message = body.message || body.error || message
    } catch {
      // non-JSON error body — keep the status code message
    }
    throw new Error(message)
  }

  // 204 No Content or empty body
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export const api = {
  get:  (path)       => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
}
