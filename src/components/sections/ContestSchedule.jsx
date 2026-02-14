import { useState, useCallback } from 'react'
import ContestDetailsModal from './ContestDetailsModal'

const formatDate = (date, options) => {
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', options)
}

const formatTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '—'
  return `₹${Number(value).toLocaleString('en-IN')}`
}

const getStatusClass = (status) => {
  if (status === 'Live') return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
  if (status === 'Upcoming') return 'border-amber-500/40 bg-amber-500/10 text-amber-200'
  return 'border-white/10 bg-white/5 text-haze/70'
}

const ContestSchedule = ({
  contests = [],
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  market,
  onMarketChange,
  loading,
  error,
  onLoadContestDetails,
}) => {
  const [expandedContest, setExpandedContest] = useState(null)
  const [selectedContest, setSelectedContest] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [detailsLoading, setDetailsLoading] = useState(false)

  const handleViewContest = useCallback(
    async (contest) => {
      setSelectedContest(contest)
      setDetailsLoading(true)
      try {
        const data = await onLoadContestDetails(contest._id)
        setLeaderboard(data?.leaderboard || data?.entries || [])
      } catch (err) {
        console.error('Failed to load contest details:', err)
        setLeaderboard([])
      } finally {
        setDetailsLoading(false)
      }
    },
    [onLoadContestDetails],
  )

  const handleCloseModal = () => {
    setSelectedContest(null)
    setLeaderboard([])
  }

  return (
    <section className="flex flex-col gap-6">
      {/* Filters */}
      <div className="rounded-3xl border border-white/10 bg-night/80 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-haze/50">Contests by Date Range</p>
            <h3 className="text-lg font-semibold">View Multiple Days Contests</h3>
            <p className="mt-2 text-sm text-haze/70">Select date range and market to view all contests.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-haze/50">
              From Date
              <input
                type="date"
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                value={dateFrom}
                onChange={(event) => onDateFromChange(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-haze/50">
              To Date
              <input
                type="date"
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                value={dateTo}
                onChange={(event) => onDateToChange(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-haze/50">
              Market
              <select
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                value={market}
                onChange={(event) => onMarketChange(event.target.value)}
              >
                <option value="NSE">NSE</option>
                <option value="BSE">BSE</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-2xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="rounded-2xl border border-white/10 bg-night/80 px-4 py-6 text-sm text-haze/70">
          Loading contests for the selected date range...
        </div>
      )}

      {/* Summary Card */}
      {!loading && !error && (
        <div className="rounded-3xl border border-white/10 bg-slate/80 p-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Date Range Summary</p>
              <p className="mt-1 text-xs text-haze/60">
                {formatDate(dateFrom, { day: '2-digit', month: 'short', year: 'numeric' })} to{' '}
                {formatDate(dateTo, { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-haze/50">Total Contests</p>
                <p className="mt-1 text-2xl font-semibold text-white">{contests.length}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-haze/50">Market</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-200">{market}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contests Table */}
      {!loading && !error && contests.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-night/80 overflow-x-auto shadow-xl">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-slate/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                  Contest Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                  Entry Close Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                  Start Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                  End Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                  Entry Fee
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                  Prize Pool
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                  Spots
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest, index) => (
                <tr
                  key={contest._id || index}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedContest(expandedContest === contest._id ? null : contest._id)
                      }
                      className="text-left"
                    >
                      <p className="text-sm font-semibold text-white hover:text-emerald-200 transition">
                        {contest.name}
                      </p>
                      <p className="text-xs text-haze/60">{contest.marketType}</p>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium capitalize text-haze">
                      {contest.contestDurationType || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-haze">
                      {formatDate(contest.entryCloseTime, { day: '2-digit', month: 'short' })} {formatTime(contest.entryCloseTime)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-haze">
                      {formatDate(contest.contestStartTime, { day: '2-digit', month: 'short' })} {formatTime(contest.contestStartTime)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-haze">
                      {formatDate(contest.contestEndTime, { day: '2-digit', month: 'short' })} {formatTime(contest.contestEndTime)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full border px-2 py-1 text-xs font-medium ${getStatusClass(
                        contest.status,
                      )}`}
                    >
                      {contest.status || 'Upcoming'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-semibold text-emerald-200">
                      {formatCurrency(contest.entryFee)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(contest.prizePool)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm text-white">
                      {contest.filledSpots || 0} / {contest.totalSpots}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleViewContest(contest)}
                      className="rounded-lg border border-emerald-400/60 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-200 transition hover:border-emerald-400 hover:bg-emerald-400/20"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && contests.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-night/80 p-6 text-center">
          <p className="text-sm text-haze/60">No contests found for the selected date range and market.</p>
        </div>
      )}

      {/* Contest Details Modal */}
      {selectedContest && (
        <ContestDetailsModal
          contest={selectedContest}
          leaderboard={leaderboard}
          onClose={handleCloseModal}
        />
      )}
    </section>
  )
}

export default ContestSchedule
