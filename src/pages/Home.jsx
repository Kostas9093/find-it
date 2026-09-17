import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import { isBiometricEnabled, enableBiometricLock, disableBiometricLock } from '../biometric.js'
import { useMedian } from '../useMedian.js'

export default function Home() {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { inApp, biometrics } = useMedian()

  const [fpEnabled, setFpEnabled] = useState(isBiometricEnabled())
  const [fpMsg, setFpMsg] = useState('')
  const [fpBusy, setFpBusy] = useState(false)

  const toggleFingerprint = async () => {
    setFpMsg('')

    // The Median biometric plugin isn't active yet.
    if (!biometrics) {
      setFpMsg(t('pluginNeeded'))
      return
    }

    setFpBusy(true)
    if (fpEnabled) {
      await disableBiometricLock()
      setFpEnabled(false)
    } else {
      const res = await enableBiometricLock()
      if (res === 'ok') setFpEnabled(true)
      else if (res === 'no-hardware') setFpMsg(t('noFingerprint'))
      else setFpMsg(t('somethingWrong'))
    }
    setFpBusy(false)
  }

  return (
    <div className="page">
      {/* Language switcher lives in the top-right corner, above the options */}
      <div className="topbar">
        <button className="link-btn" onClick={() => logout()}>
          {t('logout')}
        </button>
        <LanguageSwitcher />
      </div>

      <div className="home-content">
        <h1 className="brand">{t('appName')}</h1>
        <h2 className="home-title">{t('homeTitle')}</h2>

        <div className="options">
          <button className="option-card" onClick={() => navigate('/add')}>
            <span className="option-icon">＋</span>
            <span>{t('addItemOption')}</span>
          </button>

          <button className="option-card" onClick={() => navigate('/find')}>
            <span className="option-icon">🔍</span>
            <span>{t('findItemOption')}</span>
          </button>
        </div>

        {/* Fingerprint lock toggle — shown inside the Median app */}
        {inApp && (
          <div className="setting-row">
            <div className="setting-text">
              <div className="setting-title">{t('fingerprintLock')}</div>
              <div className="setting-hint">{t('fingerprintLockHint')}</div>
            </div>
            <button
              type="button"
              className={`toggle ${fpEnabled ? 'on' : ''}`}
              onClick={toggleFingerprint}
              disabled={fpBusy}
              aria-pressed={fpEnabled}
            >
              <span className="knob" />
            </button>
          </div>
        )}
        {fpMsg && <p className="error center">{fpMsg}</p>}
      </div>
    </div>
  )
}
