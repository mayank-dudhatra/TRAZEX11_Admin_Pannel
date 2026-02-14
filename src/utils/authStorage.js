const TOKEN_KEY = 'admin_token'
const TOKEN_EXP_KEY = 'admin_token_exp'
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

const getStoredToken = () => localStorage.getItem(TOKEN_KEY)

const getStoredExpiry = () => {
  const raw = localStorage.getItem(TOKEN_EXP_KEY)
  return raw ? Number(raw) : 0
}

const isTokenValid = () => {
  const token = getStoredToken()
  const exp = getStoredExpiry()
  return Boolean(token && exp && Date.now() < exp)
}

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXP_KEY)
}

const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(TOKEN_EXP_KEY, String(Date.now() + TOKEN_TTL_MS))
}

export { TOKEN_TTL_MS, clearToken, getStoredExpiry, getStoredToken, isTokenValid, saveToken }
