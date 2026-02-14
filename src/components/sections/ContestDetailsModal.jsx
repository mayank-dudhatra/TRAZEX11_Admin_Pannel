const formatCurrency = (value) => {
  if (value === undefined || value === null) return '—'
  return `₹${Number(value).toLocaleString('en-IN')}`
}

const ContestDetailsModal = ({ contest, leaderboard = [], onClose }) => {
  if (!contest) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-night shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-slate/80 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-haze/50">Contest Details</p>
            <h2 className="text-2xl font-semibold text-white">{contest.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-black/30 p-3 text-white transition hover:border-white/30"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto p-6">
          <div className="grid gap-6">
            {/* Prize Breakup Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Prize Breakup</h3>
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate/80">
                <table className="w-full">
                  <thead className="border-b border-white/10 bg-black/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                        Rank From
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                        Rank To
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                        Winners
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                        Prize Each
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                        Total Prize
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contest.prizeBreakup && contest.prizeBreakup.length > 0 ? (
                      contest.prizeBreakup.map((prize, index) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition">
                          <td className="px-4 py-3 text-sm text-haze">{prize.rankFrom}</td>
                          <td className="px-4 py-3 text-sm text-haze">{prize.rankTo}</td>
                          <td className="px-4 py-3 text-sm font-medium text-white">{prize.winners}</td>
                          <td className="px-4 py-3 text-sm text-emerald-200">
                            {formatCurrency(prize.prizeEach)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-white">
                            {formatCurrency(prize.totalPrize)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-sm text-haze/60">
                          No prize breakup available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Leaderboard Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Leaderboard</h3>
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate/80">
                <table className="w-full">
                  <thead className="border-b border-white/10 bg-black/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                        Team Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                        User
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                        Points
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-haze/50">
                        Prize
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard && leaderboard.length > 0 ? (
                      leaderboard.map((entry, index) => {
                        const rank = index + 1
                        let prizeAmount = 0
                        if (contest.prizeBreakup) {
                          const matchingPrize = contest.prizeBreakup.find(
                            (p) => rank >= p.rankFrom && rank <= p.rankTo,
                          )
                          prizeAmount = matchingPrize ? matchingPrize.prizeEach : 0
                        }
                        return (
                          <tr
                            key={entry._id || index}
                            className={`border-b border-white/10 transition ${
                              rank === 1 ? 'bg-amber-500/10' : rank === 2 ? 'bg-slate-400/10' : rank === 3 ? 'bg-orange-700/10' : 'hover:bg-white/5'
                            }`}
                          >
                            <td className="px-4 py-3">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                                {rank}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-white">{entry.teamName || '—'}</td>
                            <td className="px-4 py-3 text-sm text-haze">{entry.userName || entry.userId || '—'}</td>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-white">
                              {entry.points || 0}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-200">
                              {formatCurrency(prizeAmount)}
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-sm text-haze/60">
                          No leaderboard data available yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-white/10 bg-slate/80 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-emerald-400/90 px-6 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContestDetailsModal
