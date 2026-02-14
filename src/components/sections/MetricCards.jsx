function MetricCards({ cards, dashboard, loading }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={card.key}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate/80 p-6 shadow-lg transition hover:shadow-glow"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="absolute -right-12 top-6 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
          <p className="text-xs uppercase tracking-[0.2em] text-haze/50">{card.label}</p>
          <p className={`mt-4 text-3xl font-semibold ${card.tone}`}>
            {loading ? '—' : dashboard[card.key]}
          </p>
        </div>
      ))}
    </section>
  )
}

export default MetricCards
