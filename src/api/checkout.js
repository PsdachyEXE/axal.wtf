import { api } from './client'

export const initiateCheckout = (data) =>
  api.post('/api/checkout', data)
