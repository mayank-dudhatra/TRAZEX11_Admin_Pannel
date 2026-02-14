function UserProfile({ selectedUser, loading, topLocations }) {
  const resolvedLocations = topLocations.length
    ? topLocations
    : ['Mumbai, IN', 'Dubai, AE', 'London, UK']

  return (
    <div className="rounded-3xl border border-white/10 bg-slate/80 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">User Profile</h3>
        {loading && <span className="text-xs text-haze/60">Loading...</span>}
      </div>
      {selectedUser ? (
        <div className="mt-6 space-y-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-haze/50">Name</p>
            <p className="text-base font-medium text-white">{selectedUser.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-haze/50">Email</p>
            <p className="text-haze/80">{selectedUser.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-haze/50">Joined</p>
            <p className="text-haze/80">{selectedUser.createdAt}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-haze/50">Flags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(selectedUser.flags || ['None']).map((flag) => (
                <span key={flag} className="rounded-full border border-white/10 px-3 py-1 text-xs">
                  {flag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-haze/60">Select a user to inspect profile details.</p>
      )}
      <div className="mt-6 rounded-2xl border border-white/10 bg-night/70 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-haze/50">Top locations</p>
        <div className="mt-3 space-y-2 text-sm">
          {resolvedLocations.map((location) => (
            <div key={location} className="flex items-center justify-between">
              <span className="text-haze/80">{location}</span>
              <span className="text-xs text-haze/50">Active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
