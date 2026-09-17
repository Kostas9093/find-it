import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      setBusy(true)
      await resetPassword(email)
      setMessage(t('resetEmailSent'))
    } catch (err) {
      // Show the same confirmation even for unknown emails (privacy), but
      // surface a real error for an obviously invalid address.
      if (err?.code?.includes('invalid-email')) {
        setError(t('invalidEmail'))
      } else {
        setMessage(t('resetEmailSent'))
      }
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
        <h2>{t('resetPasswordTitle')}</h2>

        <form onSubmit={handleSubmit}>
          <label>{t('email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <button type="submit" className="primary" disabled={busy}>
            {busy ? t('loading') : t('sendResetLink')}
          </button>
        </form>

        <p className="muted">
          <Link to="/login">{t('backToLogin')}</Link>
        </p>
      </div>
    </div>
  )
}
