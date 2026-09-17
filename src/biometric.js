// -----------------------------------------------------------------------------
// FINGERPRINT (BIOMETRIC) LOCK — Android via Median.co
// -----------------------------------------------------------------------------
// Fingerprint only works inside the app built by Median (it uses the phone's
// hardware). In a normal web browser there is no fingerprint reader, so all of
// this stays switched off and the app behaves normally.
//
// Median exposes a "median.auth" bridge:
//   - median.auth.status() -> tells us if a fingerprint is enrolled
//   - median.auth.save()   -> stores a secret unlocked by fingerprint
//   - median.auth.get()    -> prompts the fingerprint and returns the secret
//   - median.auth.delete() -> removes the stored secret
// Docs: https://median.co/docs/android-biometric-auth
//
// We don't need the secret's contents; we only use a successful "get" as proof
// that the correct fingerprint was scanned, to unlock the app.
// -----------------------------------------------------------------------------

const SECRET = 'findit-unlock'
const SETTING_KEY = 'findit_biometric_enabled'

// Are we running inside the Median native app (not a plain browser)?
export function isInMedian() {
  return typeof window !== 'undefined' && !!(window.median && window.median.auth)
}

export function isBiometricEnabled() {
  return localStorage.getItem(SETTING_KEY) === '1'
}

function setEnabledFlag(on) {
  if (on) localStorage.setItem(SETTING_KEY, '1')
  else localStorage.removeItem(SETTING_KEY)
}

async function getStatus() {
  if (!isInMedian()) return { hasTouchId: false, hasSecret: false }
  try {
    return await window.median.auth.status({ minimumAndroidBiometric: 'strong' })
  } catch {
    return { hasTouchId: false, hasSecret: false }
  }
}

// Turn the fingerprint lock ON. Returns: 'ok' | 'no-hardware' | 'error'.
export async function enableBiometricLock() {
  if (!isInMedian()) return 'error'
  const status = await getStatus()
  if (!status.hasTouchId) return 'no-hardware'
  try {
    await window.median.auth.save({
      secret: SECRET,
      minimumAndroidBiometric: 'strong',
    })
    setEnabledFlag(true)
    return 'ok'
  } catch {
    return 'error'
  }
}

// Turn the fingerprint lock OFF and forget the stored secret.
export async function disableBiometricLock() {
  setEnabledFlag(false)
  if (!isInMedian()) return
  try {
    await window.median.auth.delete()
  } catch {
    /* ignore */
  }
}

// Prompt the fingerprint. Resolves true on success, false otherwise.
// Outside Median we resolve true so the app is never stuck locked in a browser.
export async function verifyFingerprint() {
  if (!isInMedian()) return true
  try {
    const data = await window.median.auth.get({
      minimumAndroidBiometric: 'strong',
      prompt: 'Unlock Find It',
    })
    return !!(data && data.success)
  } catch {
    return false
  }
}
