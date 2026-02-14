function UserModeration({
  users,
  loading,
  statusFilter,
  onStatusFilter,
  onSelectUser,
  onToggleStatus,
  onDeleteUser,
  page,
  onPrevPage,
  onNextPage,
}) {
  const filteredUsers = statusFilter === 'all' ? users : users.filter((user) => user.status === statusFilter)

  return (
    <div className="rounded-3xl border border-white/10 bg-night/80 p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">User Moderation</h3>
        <div className="flex items-center gap-2 text-xs">
          {['all', 'active', 'suspended'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onStatusFilter(status)}
              className={`rounded-full border px-3 py-1 transition ${
                statusFilter === status
                  ? 'border-ember/60 bg-ember/20 text-ember'
                  : 'border-white/10 text-haze/70 hover:border-white/30'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate/80 text-xs uppercase tracking-widest text-haze/50">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && (
              <tr>
                <td className="px-4 py-6 text-haze/60" colSpan={4}>
                  Loading users...
                </td>
              </tr>
            )}
            {!loading && filteredUsers.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-haze/60" colSpan={4}>
                  No users found for this filter.
                </td>
              </tr>
            )}
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectUser(user.id)}
                    className="font-medium text-haze hover:text-white"
                  >
                    {user.name}
                  </button>
                </td>
                <td className="px-4 py-3 text-haze/70">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      user.status === 'active'
                        ? 'bg-neon/20 text-neon'
                        : 'bg-ember/20 text-ember'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(user)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-haze/70 hover:border-white/30"
                    >
                      Toggle status
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteUser(user.id)}
                      className="rounded-full border border-ember/40 px-3 py-1 text-xs text-ember"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-haze/60">
        <p>Showing page {page}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrevPage}
            className="rounded-full border border-white/10 px-3 py-1"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={onNextPage}
            className="rounded-full border border-white/10 px-3 py-1"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserModeration
