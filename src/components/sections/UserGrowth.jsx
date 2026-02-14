const defaultBars = [30, 44, 38, 52, 61, 49, 70, 64, 58, 72]

function UserGrowth({ bars = defaultBars }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-night/80 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">User Growth</h3>
        <span className="text-xs uppercase tracking-[0.2em] text-haze/50">Last 30d</span>
      </div>
      <div className="mt-6 h-48 rounded-2xl border border-white/10 bg-gradient-to-br from-ember/20 via-transparent to-neon/10 p-4">
        <div className="flex h-full items-end gap-2">
          {bars.map((value, idx) => (
            <div
              key={`${value}-${idx}`}
              className="flex-1 rounded-xl bg-ember/80"
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserGrowth
