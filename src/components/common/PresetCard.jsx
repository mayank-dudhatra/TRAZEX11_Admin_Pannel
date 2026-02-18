const PresetCard = ({ preset, selected, onSelect }) => {
  const winnersCount = preset.prizeBreakup.reduce((sum, range) => sum + Number(range.winners || 0), 0)

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border p-3 text-left transition ${
        selected
          ? 'border-emerald-400/70 bg-emerald-500/10'
          : 'border-white/10 bg-black/20 hover:border-white/30'
      }`}
    >
      <div className="text-sm font-semibold text-white">{preset.label}</div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-white/70">
        <div>Entry: ₹{preset.entryFee}</div>
        <div>Spots: {preset.totalSpots}</div>
        <div>Teams/User: {preset.maximumTeamPerUser}</div>
        <div>Prize Pool: ₹{preset.prizePool}</div>
        <div className="col-span-2">Prize Ranges: {preset.prizeBreakup.length} • Winners: {winnersCount}</div>
      </div>
    </button>
  )
}

export default PresetCard
