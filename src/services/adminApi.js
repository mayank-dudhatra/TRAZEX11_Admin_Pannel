const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

const createFetchJson = (onUnauthorized) => {
  return async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include', // Include cookies automatically
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })

    if (response.status === 401 || response.status === 403) {
      if (onUnauthorized) onUnauthorized()
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'Request failed')
    }

    return response.json()
  }
}

const createAdminApi = ({ onUnauthorized }) => {
  const fetchJson = createFetchJson(onUnauthorized)

  return {
    login: async (payload) => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Login failed')
      }

      return response.json()
    },
    logout: async () => {
      const response = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Logout failed')
      }

      return response.json()
    },
    getDashboard: () => fetchJson('/admin/dashboard'),
    getUsers: (page, limit) => fetchJson(`/admin/users?page=${page}&limit=${limit}`),
    getUserById: (userId) => fetchJson(`/admin/users/${userId}`),
    updateUserStatus: (userId, isActive) =>
      fetchJson(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ isActive }),
      }),
    deleteUser: (userId) => fetchJson(`/admin/users/${userId}`, { method: 'DELETE' }),
    createDateContest: (payload) =>
      fetchJson('/admin/date-contests', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getDateContests: () => fetchJson('/admin/date-contests'),
    createContest: (payload) =>
      fetchJson('/admin/contests', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getContestsByDateMarket: (date, market) =>
      fetchJson(`/contests?date=${encodeURIComponent(date)}&market=${encodeURIComponent(market)}`),
    getContestsByDateRange: (dateFrom, dateTo, market) =>
      fetchJson(`/admin/contests?from=${encodeURIComponent(dateFrom)}&to=${encodeURIComponent(dateTo)}&market=${encodeURIComponent(market)}`),
    getContestDetails: (contestId) =>
      fetchJson(`/admin/contests/${contestId}`),
  }
}

export { createAdminApi }
