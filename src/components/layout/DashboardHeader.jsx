function DashboardHeader({ title, subtitle, badge, metrics = [] }) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl bg-night/80 p-6 shadow-xl backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-haze/50">{badge}</p>
        <h2 className="text-3xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-haze/70">{subtitle}</p>
      </div>
      {metrics.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-slate/70 px-4 py-3"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-haze/50">{metric.label}</p>
              <p className={`text-xl font-semibold ${metric.tone || ''}`}>{metric.value}</p>
            </div>
          ))}
        </div>
      )}
    </header>
  )
}

export default DashboardHeader
