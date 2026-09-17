import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

export default function Signup() {
  const { t } = useTranslation()
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) return setError(t('passwordTooShort'))
    if (password !== confirm) return setError(t('passwordsDontMatch'))

    try {
      setBusy(true)
      await signup(email, password)
      navigate('/') // straight to home after the account is created
    } catch (err) {
      setError(mapAuthError(err, t))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="topbar">
        <LanguageSwitcher />
      </div>

      <div className="auth-card">
        <h1 className="brand">{t('appName')}</h1>
        <h2>{t('createAccount')}</h2>
        <p className="muted">{t('privacyNote')}</p>

        <form onSubmit={handleSubmit}>
          <label>{t('email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label>{t('password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <label>{t('confirmPassword')}</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="primary" disabled={busy}>
            {busy ? t('loading') : t('signup')}
          </button>
        </form>

        <p className="muted">
          {t('haveAccount')} <Link to="/login">{t('login')}</Link>
        </p>
      </div>
    </div>
  )
}

// Turn Firebase error codes into friendly text.
export function mapAuthError(err, t) {
  const code = err?.code || ''
  // App not connected to Firebase yet (keys still placeholders / wrong).
  if (
    code.includes('api-key-not-valid') ||
    code.includes('invalid-api-key') ||
    code.includes('configuration-not-found') ||
    code.includes('app-not-authorized')
  )
    return t('configNotSet')
  // Email/Password sign-in method not turned on in the Firebase console.
  if (code.includes('operation-not-allowed')) return t('emailAuthDisabled')
  if (code.includes('network-request-failed')) return t('networkError')
  if (code.includes('email-already-in-use')) return t('emailInUse')
  if (code.includes('invalid-email')) return t('invalidEmail')
  if (code.includes('weak-password')) return t('passwordTooShort')
  if (
    code.includes('invalid-credential') ||
    code.includes('wrong-password') ||
    code.includes('user-not-found')
  )
    return t('wrongCredentials')
  // Unknown: show the raw code so the exact problem is visible.
  return `${t('somethingWrong')}${code ? ` (${code})` : ''}`
}
