function RiskFlags({ flags }) {
  const resolvedFlags = flags.length ? flags : ['Multiple login failures', 'Unusual location hops']

  return (
    <div className="rounded-3xl border border-white/10 bg-slate/80 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Risk Flags</h3>
        <span className="text-xs uppercase tracking-[0.2em] text-haze/50">Today</span>
      </div>
      <div className="mt-6 space-y-4">
        {resolvedFlags.map((flag) => (
          <div key={flag} className="rounded-2xl border border-white/10 bg-night/70 px-4 py-3">
            <p className="text-sm text-haze/80">{flag}</p>
            <p className="text-xs text-ember/80">Needs review</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RiskFlags
