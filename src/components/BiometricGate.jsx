import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  isInMedian,
  isBiometricEnabled,
  verifyFingerprint,
} from '../biometric.js'

// Shows a lock screen (fingerprint required) when the app opens, but only
// inside the Median app AND when the user turned the fingerprint lock on.
// Everywhere else it just renders the app normally.
export default function BiometricGate({ children }) {
  const { t } = useTranslation()
  const active = isInMedian() && isBiometricEnabled()

  const [locked, setLocked] = useState(active)
  const [checking, setChecking] = useState(false)

  const attempt = async () => {
    setChecking(true)
    const ok = await verifyFingerprint()
    setChecking(false)
    if (ok) setLocked(false)
  }

  useEffect(() => {
    if (!active) return
    attempt()
    // Re-lock whenever the app goes to the background, so returning to it asks
    // for the fingerprint again.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') setLocked(true)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!locked) return children

  return (
    <div className="center-screen">
      <div className="lock-screen">
        <div className="lock-icon">🔒</div>
        <h1 className="brand">{t('appName')}</h1>
        <p className="muted">{t('unlockPrompt')}</p>
        <button className="primary" onClick={attempt} disabled={checking}>
          {checking ? t('loading') : t('unlockWithFingerprint')}
        </button>
      </div>
    </div>
  )
}
