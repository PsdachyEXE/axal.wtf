import { api } from './client'

// POST /api/checkout
// Body: { product: string, tier: string, price: string, name: string, email: string }
// Returns: { redirectUrl: string } or payment provider session object
export const initiateCheckout = (data) =>
  api.post('/api/checkout', data)
