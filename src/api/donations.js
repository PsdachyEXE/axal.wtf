import { api } from './client'

export const submitDonation = (data) =>
  api.post('/api/donations', data)

export const fetchDonationFeed = () =>
  api.get('/api/donations/feed')

export const fetchLeaderboard = () =>
  api.get('/api/donations/leaderboard')
