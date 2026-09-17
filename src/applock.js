// -----------------------------------------------------------------------------
// APP LOCK — verify the account password locally (offline).
// -----------------------------------------------------------------------------
// So the app can ask for the password every time it opens WITHOUT needing the
// internet, we store a secure one-way hash of the password on the device (never
// the password itself). The hash is created with PBKDF2 (150k iterations), so
// it cannot be reversed back into the password.
//
// The stored hash is refreshed every time the user logs in with their password,
// so it stays correct even after a password reset by email.
// -----------------------------------------------------------------------------

const PBKDF2_ITERATIONS = 150000
const enc = new TextEncoder()
const keyFor = (uid) => `findit_lock_${uid}`

function toB64(bytes) {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}
function fromB64(b64) {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}
function randomBytes(n) {
  return crypto.getRandomValues(new Uint8Array(n))
}

async function derive(password, salt) {
  const base = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    base,
    256,
  )
  return new Uint8Array(bits)
}

export function hasLock(uid) {
  return !!localStorage.getItem(keyFor(uid))
}

export async function storeLockPassword(uid, password) {
  const salt = randomBytes(16)
  const hash = await derive(password, salt)
  localStorage.setItem(
    keyFor(uid),
    JSON.stringify({ salt: toB64(salt), hash: toB64(hash) }),
  )
}

export async function verifyLockPassword(uid, password) {
  const raw = localStorage.getItem(keyFor(uid))
  if (!raw) return false
  const { salt, hash } = JSON.parse(raw)
  const test = await derive(password, fromB64(salt))
  const expected = fromB64(hash)
  if (test.length !== expected.length) return false
  // Constant-time comparison.
  let diff = 0
  for (let i = 0; i < test.length; i++) diff |= test[i] ^ expected[i]
  return diff === 0
}
