import { useEffect, useMemo, useState } from 'react'

const defaultPrizeRange = { rankFrom: '', rankTo: '', prizeEach: '' }

const toNumber = (value) => (value === '' ? '' : Number(value))

const CreateContest = ({ onCreate, onLoadDateContests }) => {
  const [dateContests, setDateContests] = useState([])
  const [loadingDates, setLoadingDates] = useState(false)
  const [dateError, setDateError] = useState('')
  const [selectedDateContestId, setSelectedDateContestId] = useState('')
  const [form, setForm] = useState({
    name: '',
    contestStartTime: '',
    contestEndTime: '',
    entryCloseTime: '',
    entryFee: '',
    totalSpots: '',
    maximumTeamPerUser: '',
    prizePool: '',
  })
  const [prizeBreakup, setPrizeBreakup] = useState([{ ...defaultPrizeRange }])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const hasDateContest = Boolean(selectedDateContestId)

  useEffect(() => {
    let active = true
    const loadDateContests = async () => {
      setLoadingDates(true)
      setDateError('')
      try {
        const data = await onLoadDateContests()
        const list = data?.dateContests || data?.data || data || []
        if (active) {
          setDateContests(Array.isArray(list) ? list : [])
        }
      } catch (loadError) {
        if (active) {
          setDateContests([])
          setDateError(loadError?.message || 'Failed to load date contests.')
        }
      } finally {
        if (active) setLoadingDates(false)
      }
    }

    loadDateContests()
    return () => {
      active = false
    }
  }, [onLoadDateContests])

  const timingInfo = useMemo(() => {
    const entryCloseDateTime = form.entryCloseTime ? new Date(form.entryCloseTime) : null
    const startDateTime = form.contestStartTime ? new Date(form.contestStartTime) : null
    const endDateTime = form.contestEndTime ? new Date(form.contestEndTime) : null
    return { entryCloseDateTime, startDateTime, endDateTime }
  }, [form.entryCloseTime, form.contestStartTime, form.contestEndTime])

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePrizeChange = (index, field, value) => {
    setPrizeBreakup((prev) =>
      prev.map((range, idx) => (idx === index ? { ...range, [field]: value } : range)),
    )
  }

  const addPrizeRange = () => {
    setPrizeBreakup((prev) => [...prev, { ...defaultPrizeRange }])
  }

  const removePrizeRange = (index) => {
    setPrizeBreakup((prev) => prev.filter((_, idx) => idx !== index))
  }

  const getDateContestLabel = (contest) => {
    const start = contest?.startDate ? new Date(contest.startDate) : null
    const end = contest?.endDate ? new Date(contest.endDate) : null
    const duration = contest?.contestDurationType || 'date'
    const market = contest?.marketType || 'NSE'
    const startLabel = start && !Number.isNaN(start.getTime()) ? start.toLocaleDateString('en-GB') : '—'
    const endLabel = end && !Number.isNaN(end.getTime()) ? end.toLocaleDateString('en-GB') : '—'
    return `${duration.toUpperCase()} | ${market} | ${startLabel} - ${endLabel}`
  }

  const validate = () => {
    if (!selectedDateContestId) return 'Select a date contest first.'
    if (!form.name.trim()) return 'Name is required.'
    if (!form.entryCloseTime || !form.contestStartTime || !form.contestEndTime) {
      return 'All timing fields are required.'
    }
    if (form.entryFee === '' || form.totalSpots === '' || form.maximumTeamPerUser === '' || form.prizePool === '') {
      return 'All financial fields are required.'
    }

    const { entryCloseDateTime, startDateTime, endDateTime } = timingInfo
    if (!entryCloseDateTime || !startDateTime || !endDateTime) {
      return 'Invalid date or time values.'
    }
    if (entryCloseDateTime >= startDateTime) {
      return 'Entry close time must be before contest start time.'
    }
    if (endDateTime <= startDateTime) {
      return 'Contest end time must be after contest start time.'
    }

    for (const [index, range] of prizeBreakup.entries()) {
      if (range.rankFrom === '' || range.rankTo === '' || range.prizeEach === '') {
        return `Prize range ${index + 1} is incomplete.`
      }
      const rankFrom = Number(range.rankFrom)
      const rankTo = Number(range.rankTo)
      const prizeEach = Number(range.prizeEach)
      if (Number.isNaN(rankFrom) || Number.isNaN(rankTo)) {
        return `Prize range ${index + 1} has invalid ranks.`
      }
      if (rankFrom > rankTo) {
        return `Prize range ${index + 1} must have rankFrom <= rankTo.`
      }
      if (Number.isNaN(prizeEach) || prizeEach < 0) {
        return `Prize range ${index + 1} has invalid prize each value.`
      }
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    const payload = {
      dateContestId: selectedDateContestId,
      name: form.name.trim(),
      entryFee: Number(form.entryFee),
      totalSpots: Number(form.totalSpots),
      maximumTeamPerUser: Number(form.maximumTeamPerUser),
      prizePool: Number(form.prizePool),
      entryCloseTime: timingInfo.entryCloseDateTime.toISOString(),
      contestStartTime: timingInfo.startDateTime.toISOString(),
      contestEndTime: timingInfo.endDateTime.toISOString(),
      prizeBreakup: prizeBreakup.map((range) => {
        const rankFrom = Number(range.rankFrom)
        const rankTo = Number(range.rankTo)
        const prizeEach = Number(range.prizeEach)
        const winners = rankFrom && rankTo && rankTo >= rankFrom ? rankTo - rankFrom + 1 : 0
        const totalPrize = prizeEach && winners ? prizeEach * winners : 0
        return {
          rankFrom,
          rankTo,
          prizeEach,
          winners,
          totalPrize,
        }
      }),
    }

    setSubmitting(true)
    try {
      await onCreate(payload)
      setSuccess('Contest created successfully.')
      setForm({
        name: '',
        contestStartTime: '',
        contestEndTime: '',
        entryCloseTime: '',
        entryFee: '',
        totalSpots: '',
        maximumTeamPerUser: '',
        prizePool: '',
      })
      setPrizeBreakup([{ ...defaultPrizeRange }])
    } catch (submitError) {
      setError(submitError?.message || 'Failed to create contest.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white">Create Contest</h2>
        <p className="text-sm text-white/60">
          Link contests to a date card, then configure timings and prize distribution.
        </p>
      </div>

      <form className="mt-6 flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Date Contest</h3>
          <div className="grid gap-4">
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Select Date Contest
              <select
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                value={selectedDateContestId}
                onChange={(event) => setSelectedDateContestId(event.target.value)}
                disabled={loadingDates}
                required
              >
                <option value="">{loadingDates ? 'Loading...' : 'Choose date contest'}</option>
                {dateContests.map((contest) => (
                  <option key={contest._id} value={contest._id}>
                    {getDateContestLabel(contest)}
                  </option>
                ))}
              </select>
            </label>
            {dateError && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {dateError}
              </div>
            )}
            {!dateError && !loadingDates && dateContests.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                No date contests found. Create a date contest first.
              </div>
            )}
          </div>
        </div>

        <div className={`flex flex-col gap-6 ${hasDateContest ? '' : 'opacity-60'}`}>
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Basic Info</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Name
                <input
                  type="text"
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                  value={form.name}
                  onChange={(event) => handleFieldChange('name', event.target.value)}
                  placeholder="Contest name"
                  required
                  disabled={!hasDateContest}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Timing</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Entry Close Time
                <input
                  type="datetime-local"
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                  value={form.entryCloseTime}
                  onChange={(event) => handleFieldChange('entryCloseTime', event.target.value)}
                  required
                  disabled={!hasDateContest}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Contest Start Time
                <input
                  type="datetime-local"
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                  value={form.contestStartTime}
                  onChange={(event) => handleFieldChange('contestStartTime', event.target.value)}
                  required
                  disabled={!hasDateContest}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Contest End Time
                <input
                  type="datetime-local"
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                  value={form.contestEndTime}
                  onChange={(event) => handleFieldChange('contestEndTime', event.target.value)}
                  required
                  disabled={!hasDateContest}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Financial Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Entry Fee
                <input
                  type="number"
                  min="0"
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                  value={form.entryFee}
                  onChange={(event) => handleFieldChange('entryFee', toNumber(event.target.value))}
                  required
                  disabled={!hasDateContest}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Total Spots
                <input
                  type="number"
                  min="1"
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                  value={form.totalSpots}
                  onChange={(event) => handleFieldChange('totalSpots', toNumber(event.target.value))}
                  required
                  disabled={!hasDateContest}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Max Teams Per User
                <input
                  type="number"
                  min="1"
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                  value={form.maximumTeamPerUser}
                  onChange={(event) => handleFieldChange('maximumTeamPerUser', toNumber(event.target.value))}
                  required
                  disabled={!hasDateContest}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Prize Pool
                <input
                  type="number"
                  min="0"
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                  value={form.prizePool}
                  onChange={(event) => handleFieldChange('prizePool', toNumber(event.target.value))}
                  required
                  disabled={!hasDateContest}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Prize Distribution</h3>
              <button
                type="button"
                onClick={addPrizeRange}
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
                disabled={!hasDateContest}
              >
                Add Range
              </button>
            </div>

            <div className="grid gap-4">
              {prizeBreakup.map((range, index) => {
                const rankFrom = Number(range.rankFrom)
                const rankTo = Number(range.rankTo)
                const prizeEach = Number(range.prizeEach)
                const winners =
                  Number.isNaN(rankFrom) || Number.isNaN(rankTo) || rankTo < rankFrom
                    ? 0
                    : rankTo - rankFrom + 1
                const totalPrize = Number.isNaN(prizeEach) ? 0 : winners * prizeEach
                return (
                <div
                  key={`prize-${index}`}
                  className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-3 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]"
                >
                  <label className="flex flex-col gap-2 text-sm text-white/70">
                    Rank From
                    <input
                      type="number"
                      min="1"
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                      value={range.rankFrom}
                      onChange={(event) => handlePrizeChange(index, 'rankFrom', toNumber(event.target.value))}
                      required
                      disabled={!hasDateContest}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-white/70">
                    Rank To
                    <input
                      type="number"
                      min="1"
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                      value={range.rankTo}
                      onChange={(event) => handlePrizeChange(index, 'rankTo', toNumber(event.target.value))}
                      required
                      disabled={!hasDateContest}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-white/70">
                    Winners
                    <input
                      type="number"
                      className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white/70"
                      value={winners}
                      readOnly
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-white/70">
                    Prize Each
                    <input
                      type="number"
                      min="0"
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                      value={range.prizeEach}
                      onChange={(event) => handlePrizeChange(index, 'prizeEach', toNumber(event.target.value))}
                      required
                      disabled={!hasDateContest}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-white/70">
                    Total
                    <input
                      type="number"
                      className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white/70"
                      value={Number.isNaN(totalPrize) ? 0 : totalPrize}
                      readOnly
                    />
                  </label>
                  <div className="flex items-end">
                    {prizeBreakup.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrizeRange(index)}
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:border-white/30 hover:text-white"
                        disabled={!hasDateContest}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )})}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !hasDateContest}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-400/90 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating...' : 'Create Contest'}
        </button>
      </form>
    </section>
  )
}

export default CreateContest
