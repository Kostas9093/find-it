import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { useAuth } from '../contexts/AuthContext.jsx'
import { hasLock, verifyLockPassword, storeLockPassword } from '../applock.js'
import { isBiometricEnabled, verifyFingerprint } from '../biometric.js'
import { useMedian } from '../useMedian.js'
import LanguageSwitcher from './LanguageSwitcher.jsx'

// Shows a lock screen whenever the user is logged in but hasn't passed the lock
// this session. Unlock with the password (always) or fingerprint (if enabled).
export default function AppLock({ children }) {
  const { t } = useTranslation()
  const { user, unlocked, unlockApp, lockApp, logout } = useAuth()
  const { biometrics } = useMedian()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const fingerprintReady = biometrics && isBiometricEnabled()

  const tryFingerprint = async () => {
    const ok = await verifyFingerprint()
    if (ok) unlockApp()
  }

  // When the lock screen is showing and fingerprint is on, prompt it right away.
  // Also runs once the Median bridge becomes available (fingerprintReady flips).
  useEffect(() => {
    if (user && !unlocked && fingerprintReady) tryFingerprint()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, unlocked, fingerprintReady])

  // Re-lock when the app goes to the background, so returning asks again.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') lockApp()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submitPassword = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      let ok = false
      if (hasLock(user.uid)) {
        ok = await verifyLockPassword(user.uid, password)
      } else {
        // No local hash yet (e.g. session was already open before this
        // feature): verify against Firebase once, then store it for offline use.
        try {
          const cred = EmailAuthProvider.credential(user.email, password)
          await reauthenticateWithCredential(user, cred)
          await storeLockPassword(user.uid, password)
          ok = true
        } catch {
          ok = false
        }
      }
      if (ok) {
        setPassword('')
        unlockApp()
      } else {
        setError(t('wrongPassword'))
      }
    } finally {
      setBusy(false)
    }
  }

  // Not logged in → let the normal login/signup routes show.
  if (!user) return children
  // Logged in and already unlocked → show the app.
  if (unlocked) return children

  // Logged in but locked → the lock screen.
  return (
    <div className="auth-screen">
      <div className="topbar">
        <LanguageSwitcher />
      </div>

      <div className="auth-card">
        <div className="lock-icon">🔒</div>
        <h1 className="brand">{t('appName')}</h1>
        <h2>{t('lockTitle')}</h2>

        <form onSubmit={submitPassword}>
          <label>{t('password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="primary" disabled={busy}>
            {busy ? t('loading') : t('unlock')}
          </button>
        </form>

        {fingerprintReady && (
          <button type="button" className="secondary unlock-fp" onClick={tryFingerprint}>
            {t('unlockWithFingerprint')}
          </button>
        )}

        <p className="muted">
          <button type="button" className="link-btn" onClick={logout}>
            {t('logOutInstead')}
          </button>
        </p>
      </div>
    </div>
  )
}
