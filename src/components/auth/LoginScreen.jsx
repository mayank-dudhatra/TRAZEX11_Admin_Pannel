import BackgroundGlow from '../common/BackgroundGlow'

function LoginScreen({ form, onChange, onSubmit, loading, error }) {
  return (
    <div className="min-h-screen text-haze">
      <BackgroundGlow />
      <div className="mx-auto grid min-h-screen max-w-5xl items-center px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-night/80 p-8 shadow-2xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-haze/50">Admin access</p>
            <h1 className="mt-3 text-3xl font-semibold">Secure Control Suite</h1>
            <p className="mt-4 text-sm text-haze/70">
              Sign in to review platform health, user activity, and risk signals. Session expires
              automatically after 7 days.
            </p>
            <div className="mt-8 grid gap-4 text-sm text-haze/70">
              <div className="rounded-2xl border border-white/10 bg-slate/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-haze/50">Security</p>
                <p className="mt-2">JWT-backed admin sessions with audit-ready actions.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-haze/50">Monitoring</p>
                <p className="mt-2">Track growth, login health, and user status.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate/80 p-8 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-semibold">Admin Login</h2>
            <p className="mt-2 text-sm text-haze/70">Use your admin credentials.</p>
            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-haze/50">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => onChange('email', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-night/70 px-4 py-3 text-sm text-haze placeholder:text-haze/40 focus:border-ember/60 focus:outline-none"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-haze/50">Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(event) => onChange('password', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-night/70 px-4 py-3 text-sm text-haze placeholder:text-haze/40 focus:border-ember/60 focus:outline-none"
                  placeholder="Enter password"
                />
              </div>
              {error && <p className="text-sm text-ember">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl border border-ember/60 bg-ember/20 px-4 py-3 text-sm font-semibold text-ember transition hover:bg-ember/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
