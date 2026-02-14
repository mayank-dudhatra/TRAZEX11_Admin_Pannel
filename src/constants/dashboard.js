export const metricCards = [
  { key: 'totalUsers', label: 'Total Users', tone: 'text-haze' },
  { key: 'activeUsers', label: 'Active', tone: 'text-neon' },
  { key: 'suspendedUsers', label: 'Suspended', tone: 'text-ember' },
  { key: 'newUsers7d', label: 'New (7d)', tone: 'text-haze' },
]

export const initialDashboard = {
  totalUsers: 0,
  activeUsers: 0,
  suspendedUsers: 0,
  newUsers7d: 0,
  loginSuccessRate: 0,
  averageSessionMins: 0,
  topLocations: [],
  flags: [],
}
