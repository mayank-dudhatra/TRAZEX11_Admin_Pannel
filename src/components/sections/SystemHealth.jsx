const STATUS_STYLES = {
  healthy: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
  degraded: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  down: 'border-ember/50 bg-ember/10 text-ember',
  checking: 'border-white/10 bg-white/5 text-haze/70',
}

const STATUS_LABELS = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  down: 'Down',
  checking: 'Checking',
}

function SystemHealth({ services, metrics }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-night/80 p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-haze/50">Health</p>
          <h3 className="text-lg font-semibold">System & Database Connectivity</h3>
        </div>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
          Live monitoring
        </span>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate/70 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-white">{service.name}</p>
                <p className="text-xs text-haze/60">{service.detail}</p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs ${STATUS_STYLES[service.status]}`}
              >
                {STATUS_LABELS[service.status]}
              </span>
            </div>
          ))}
        </div>
        <div className="grid gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-slate/70 px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-haze/50">{metric.label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{metric.value}</p>
              <p className="mt-1 text-xs text-haze/60">{metric.helper}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SystemHealth
