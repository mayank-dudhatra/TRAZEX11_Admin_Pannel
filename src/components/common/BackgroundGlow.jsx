function BackgroundGlow() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 right-10 h-72 w-72 rounded-full bg-ember/20 blur-[120px]" />
      <div className="pointer-events-none absolute left-10 top-40 h-72 w-72 rounded-full bg-neon/10 blur-[140px]" />
    </div>
  )
}

export default BackgroundGlow
