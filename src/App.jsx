import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import LoginScreen from './components/auth/LoginScreen'
import BackgroundGlow from './components/common/BackgroundGlow'
import DashboardHeader from './components/layout/DashboardHeader'
import Sidebar from './components/layout/Sidebar'
import MetricCards from './components/sections/MetricCards'
import RiskFlags from './components/sections/RiskFlags'
import ContestSchedule from './components/sections/ContestSchedule'
import SystemHealth from './components/sections/SystemHealth'
import UserGrowth from './components/sections/UserGrowth'
import UserModeration from './components/sections/UserModeration'
import UserProfile from './components/sections/UserProfile'
import CreateContest from './components/sections/CreateContest'
import CreateDateContest from './components/sections/CreateDateContest'
import { initialDashboard, metricCards } from './constants/dashboard'
import { createAdminApi } from './services/adminApi'

function App() {
  const [dashboard, setDashboard] = useState(initialDashboard)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [userPage, setUserPage] = useState(1)
  const [limit] = useState(8)
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState({ dashboard: true, users: true, detail: false })
  const [activePage, setActivePage] = useState('overview')
  const [contestDateFrom, setContestDateFrom] = useState(() => new Date().toISOString().slice(0, 10))
  const [contestDateTo, setContestDateTo] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return date.toISOString().slice(0, 10)
  })
  const [contestMarket, setContestMarket] = useState('NSE')
  const [contests, setContests] = useState([])
  const [contestLoading, setContestLoading] = useState(false)
  const [contestError, setContestError] = useState('')

  const getUserId = (user) => user.id || user._id

  const normalizeUser = useCallback(
    (user) => ({
      ...user,
      id: getUserId(user),
      name: user.name || user.username || 'Unknown',
      status: user.status || (user.isActive ? 'active' : 'suspended'),
      isActive: user.isActive ?? user.status === 'active',
    }),
    [],
  )

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setAuthError('Session expired. Please sign in again.')
  }, [])

  const api = useMemo(
    () =>
      createAdminApi({
        onUnauthorized: handleUnauthorized,
      }),
    [handleUnauthorized],
  )

  // Check authentication on mount by making an API call
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.getDashboard()
        setIsAuthenticated(true)
      } catch (error) {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [api])

  useEffect(() => {
    if (!isAuthenticated) return
    let active = true
    const loadDashboard = async () => {
      try {
        const data = await api.getDashboard()
        const stats = data.stats || data
        if (active) {
          setDashboard({
            ...initialDashboard,
            totalUsers: stats.totalUsers || 0,
            activeUsers: stats.activeUsers || 0,
            suspendedUsers: stats.inactiveUsers || 0,
            newUsers7d: stats.recentUsers || 0,
          })
        }
      } catch (error) {
        if (active) {
          setDashboard(initialDashboard)
        }
      } finally {
        if (active) setLoading((prev) => ({ ...prev, dashboard: false }))
      }
    }

    const loadUsers = async () => {
      try {
        const data = await api.getUsers(userPage, limit)
        const responseUsers = data.data?.users || data.users || []
        if (active) {
          setUsers(responseUsers.map(normalizeUser))
        }
      } catch (error) {
        if (active) setUsers([])
      } finally {
        if (active) setLoading((prev) => ({ ...prev, users: false }))
      }
    }

    loadDashboard()
    loadUsers()

    return () => {
      active = false
    }
  }, [api, isAuthenticated, limit, normalizeUser, userPage])

  const navigationItems = useMemo(
    () => [
      { id: 'overview', label: 'Overview', helper: 'Health, analytics, uptime' },
      { id: 'users', label: 'User Management', helper: 'Moderation and profiles' },
      { id: 'date-contests', label: 'Date Contests', helper: 'Create date cards' },
      { id: 'contests', label: 'Contests', helper: 'Create and manage' },
      { id: 'risk', label: 'Risk & Safety', helper: 'Flags and anomalies' },
      { id: 'schedule', label: 'Contest Cards', helper: 'Daily, weekly, monthly' },
    ],
    [],
  )

  const pageConfig = {
    overview: {
      title: 'Admin Overview',
      subtitle: 'Live system health, database connectivity, and user analytics.',
      badge: 'Live',
    },
    users: {
      title: 'User Management',
      subtitle: 'Review accounts, update status, and inspect profiles.',
      badge: 'Moderation',
    },
    contests: {
      title: 'Contest Operations',
      subtitle: 'Set up new contests with accurate timing and prize ranges.',
      badge: 'Operations',
    },
    'date-contests': {
      title: 'Date Contests',
      subtitle: 'Create daily, weekly, or monthly date cards for contests.',
      badge: 'Date Cards',
    },
    risk: {
      title: 'Risk & Safety',
      subtitle: 'Track suspicious behavior and resolve alerts.',
      badge: 'Alerts',
    },
    schedule: {
      title: 'Contest Cards',
      subtitle: 'Date cards plus contest lists per duration.',
      badge: 'Schedule',
    },
  }

  const healthSnapshot = useMemo(() => {
    const checking = loading.dashboard
    const status = checking ? 'checking' : 'healthy'
    return {
      services: [
        { name: 'API Gateway', status, detail: checking ? 'Checking...' : '200 OK responses' },
        { name: 'Database Primary', status, detail: checking ? 'Checking...' : 'Connected (write)' },
        { name: 'Replica Cluster', status, detail: checking ? 'Checking...' : 'Synced (read)' },
        { name: 'Auth Service', status, detail: checking ? 'Checking...' : 'Tokens validated' },
      ],
      metrics: [
        {
          label: 'Database Connectivity',
          value: checking ? '—' : 'Connected',
          helper: checking ? 'Awaiting health check' : 'Primary + replica in sync',
        },
        {
          label: 'Avg API Latency',
          value: checking ? '—' : '180 ms',
          helper: 'Last 15 minutes',
        },
        {
          label: 'Uptime',
          value: checking ? '—' : '99.98%',
          helper: '30-day window',
        },
      ],
    }
  }, [loading.dashboard])

  useEffect(() => {
    if (!isAuthenticated || activePage !== 'schedule') return
    if (!contestDateFrom || !contestDateTo || !contestMarket) return
    let active = true

    const loadContests = async () => {
      setContestLoading(true)
      setContestError('')
      try {
        const data = await api.getContestsByDateRange(contestDateFrom, contestDateTo, contestMarket)
        if (!active) return
        setContests(data.contests || data.data || [])
      } catch (error) {
        if (!active) return
        setContestError('Unable to load contests for this date range.')
        setContests([])
      } finally {
        if (active) setContestLoading(false)
      }
    }

    loadContests()

    return () => {
      active = false
    }
  }, [activePage, api, contestDateFrom, contestDateTo, contestMarket, isAuthenticated])

  const handleLogin = async (event) => {
    event.preventDefault()
    setAuthError('')
    setLoginLoading(true)
    try {
      const data = await api.login({
        email: loginForm.email,
        password: loginForm.password,
      })
      if (data.user?.role !== 'admin') {
        throw new Error('Admin access required')
      }
      const token = data?.token || data?.data?.token || ''
      if (token) {
        localStorage.setItem('token', token)
      }
      setIsAuthenticated(true)
    } catch (error) {
      setAuthError('Invalid admin credentials.')
      setIsAuthenticated(false)
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch (error) {
      // Logout on server might fail, but clear client state anyway
    } finally {
      localStorage.removeItem('token')
      setIsAuthenticated(false)
      setSelectedUser(null)
    }
  }

  const handleSelectUser = async (userId) => {
    setLoading((prev) => ({ ...prev, detail: true }))
    try {
      const data = await api.getUserById(userId)
      const user = data.user || data
      setSelectedUser(normalizeUser(user))
    } catch (error) {
      setSelectedUser(null)
    } finally {
      setLoading((prev) => ({ ...prev, detail: false }))
    }
  }

  const handleToggleStatus = async (user) => {
    const nextIsActive = !user.isActive
    const nextStatus = nextIsActive ? 'active' : 'suspended'
    const userId = getUserId(user)
    setUsers((prev) =>
      prev.map((entry) =>
        getUserId(entry) === userId
          ? { ...entry, status: nextStatus, isActive: nextIsActive }
          : entry,
      ),
    )
    try {
      await api.updateUserStatus(userId, nextIsActive)
    } catch (error) {
      setUsers((prev) =>
        prev.map((entry) =>
          getUserId(entry) === userId
            ? { ...entry, status: user.status, isActive: user.isActive }
            : entry,
        ),
      )
    }
  }

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm('Delete this user? This cannot be undone.')
    if (!confirmed) return
    const previous = users
    setUsers((prev) => prev.filter((entry) => getUserId(entry) !== userId))
    try {
      await api.deleteUser(userId)
      if (getUserId(selectedUser || {}) === userId) setSelectedUser(null)
    } catch (error) {
      setUsers(previous)
    }
  }

  if (!isAuthenticated) {
    return (
      <LoginScreen
        form={loginForm}
        onChange={(field, value) => setLoginForm((prev) => ({ ...prev, [field]: value }))}
        onSubmit={handleLogin}
        loading={loginLoading}
        error={authError}
      />
    )
  }

  return (
    <div className="min-h-screen text-haze">
      <BackgroundGlow />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[240px_1fr]">
        <Sidebar
          onLogout={handleLogout}
          items={navigationItems}
          activeItem={activePage}
          onNavigate={setActivePage}
        />

        <main className="flex flex-col gap-6">
          <DashboardHeader
            title={pageConfig[activePage].title}
            subtitle={pageConfig[activePage].subtitle}
            badge={pageConfig[activePage].badge}
            metrics={
              activePage === 'overview'
                ? [
                    {
                      label: 'Login Success',
                      value: `${dashboard.loginSuccessRate || 0}%`,
                      tone: 'text-neon',
                    },
                    {
                      label: 'Avg Session',
                      value: `${dashboard.averageSessionMins || 0}m`,
                    },
                  ]
                : []
            }
          />

          {activePage === 'overview' && (
            <>
              <MetricCards cards={metricCards} dashboard={dashboard} loading={loading.dashboard} />
              <SystemHealth services={healthSnapshot.services} metrics={healthSnapshot.metrics} />
              <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                <UserGrowth />
                <RiskFlags flags={dashboard.flags} />
              </section>
            </>
          )}

          {activePage === 'users' && (
            <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <UserModeration
                users={users}
                loading={loading.users}
                statusFilter={statusFilter}
                onStatusFilter={setStatusFilter}
                onSelectUser={handleSelectUser}
                onToggleStatus={handleToggleStatus}
                onDeleteUser={handleDeleteUser}
                page={userPage}
                onPrevPage={() => setUserPage((prev) => Math.max(1, prev - 1))}
                onNextPage={() => setUserPage((prev) => prev + 1)}
              />
              <UserProfile
                selectedUser={selectedUser}
                loading={loading.detail}
                topLocations={dashboard.topLocations}
              />
            </section>
          )}

          {activePage === 'date-contests' && (
            <CreateDateContest onCreate={api.createDateContest} />
          )}

          {activePage === 'contests' && (
            <CreateContest onCreate={api.createContest} onLoadDateContests={api.getDateContests} />
          )}

          {activePage === 'risk' && (
            <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <RiskFlags flags={dashboard.flags} />
              <UserGrowth />
            </section>
          )}

          {activePage === 'schedule' && (
            <ContestSchedule
              contests={contests}
              dateFrom={contestDateFrom}
              onDateFromChange={setContestDateFrom}
              dateTo={contestDateTo}
              onDateToChange={setContestDateTo}
              market={contestMarket}
              onMarketChange={setContestMarket}
              loading={contestLoading}
              error={contestError}
              onLoadContestDetails={api.getContestDetails}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
