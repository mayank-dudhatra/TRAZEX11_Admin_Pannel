function Sidebar({ onLogout, items, activeItem, onNavigate }) {
  return (
    <aside className="flex h-full flex-col gap-6 rounded-3xl bg-slate/80 p-6 shadow-xl backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-haze/60">Admin</p>
        <h1 className="text-2xl font-semibold">Control Suite</h1>
      </div>
      <nav className="flex flex-col gap-2 text-sm">
        {items.map((item) => {
          const isActive = item.id === activeItem
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                isActive
                  ? 'border-emerald-400/60 bg-emerald-400/10 text-white'
                  : 'border-white/10 text-haze/80 hover:border-white/30 hover:text-white'
              }`}
            >
              <p className="text-sm font-medium">{item.label}</p>
              <p className="mt-1 text-xs text-haze/60">{item.helper}</p>
            </button>
          )
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-night/80 p-4">
        <p className="text-xs uppercase tracking-widest text-haze/50">Security</p>
        <p className="mt-2 text-sm text-haze/80">
          Token-protected admin routes with audit-ready actions.
        </p>
        <button
          type="button"
          className="mt-4 w-full rounded-xl border border-ember/50 bg-ember/10 px-4 py-2 text-sm font-medium text-ember"
        >
          Review access logs
        </button>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="rounded-2xl border border-white/10 bg-night/70 px-4 py-3 text-sm text-haze/80 transition hover:border-white/30"
      >
        Sign out
      </button>
    </aside>
  )
}

export default Sidebar
