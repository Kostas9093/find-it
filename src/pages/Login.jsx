import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext.jsx'
import { mapAuthError } from './Signup.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

export default function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setBusy(true)
      await login(email, password)
      navigate('/')
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
        <h2>{t('welcomeBack')}</h2>

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
            autoComplete="current-password"
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="primary" disabled={busy}>
            {busy ? t('loading') : t('login')}
          </button>
        </form>

        <p className="muted">
          <Link to="/forgot-password">{t('forgotPassword')}</Link>
        </p>
        <p className="muted">
          {t('noAccount')} <Link to="/signup">{t('signup')}</Link>
        </p>
      </div>
    </div>
  )
}
