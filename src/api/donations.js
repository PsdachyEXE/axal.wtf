import { api } from './client'

// POST /api/donations
// Body: { name: string, amount: number, message: string | null }
export const submitDonation = (data) =>
  api.post('/api/donations', data)

// GET /api/donations/feed
// Returns: DonationDTO[] — { id, name, amount, message, time }
export const fetchDonationFeed = () =>
  api.get('/api/donations/feed')

// GET /api/donations/leaderboard
// Returns: DonorDTO[] — { rank, name, total }
export const fetchLeaderboard = () =>
  api.get('/api/donations/leaderboard')
