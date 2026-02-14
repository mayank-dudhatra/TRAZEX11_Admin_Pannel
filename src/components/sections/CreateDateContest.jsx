import { useState } from 'react'

const CreateDateContest = ({ onCreate }) => {
  const [form, setForm] = useState({
    contestDurationType: 'daily',
    marketType: 'NSE',
    startDate: '',
    endDate: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    if (!form.startDate || !form.endDate) return 'Start and end dates are required.'
    const start = new Date(form.startDate)
    const end = new Date(form.endDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 'Invalid date values.'
    }
    if (end < start) return 'End date must be on or after the start date.'
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
      contestDurationType: form.contestDurationType,
      marketType: form.marketType,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    }

    setSubmitting(true)
    try {
      await onCreate(payload)
      setSuccess('Date contest created successfully.')
      setForm({
        contestDurationType: 'daily',
        marketType: 'NSE',
        startDate: '',
        endDate: '',
      })
    } catch (submitError) {
      setError(submitError?.message || 'Failed to create date contest.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white">Create Date Contest</h2>
        <p className="text-sm text-white/60">Define the contest date card for daily, weekly, or monthly cycles.</p>
      </div>

      <form className="mt-6 flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Date Card</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Contest Type
              <select
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                value={form.contestDurationType}
                onChange={(event) => handleFieldChange('contestDurationType', event.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Market Type
              <select
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                value={form.marketType}
                onChange={(event) => handleFieldChange('marketType', event.target.value)}
              >
                <option value="NSE">NSE</option>
                <option value="BSE">BSE</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Start Date
              <input
                type="date"
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                value={form.startDate}
                onChange={(event) => handleFieldChange('startDate', event.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              End Date
              <input
                type="date"
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                value={form.endDate}
                onChange={(event) => handleFieldChange('endDate', event.target.value)}
                required
              />
            </label>
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
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-400/90 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating...' : 'Create Date Contest'}
        </button>
      </form>
    </section>
  )
}

export default CreateDateContest
