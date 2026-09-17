import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

export default function AddItem() {
  const { t } = useTranslation()
  const { addItem } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !location.trim()) {
      setError(t('required'))
      return
    }

    try {
      setBusy(true)
      // Saved encrypted, on this device only.
      await addItem({
        name: name.trim(),
        description: description.trim(),
        location: location.trim(),
      })
      setSaved(true)
      setName('')
      setDescription('')
      setLocation('')
    } catch {
      setError(t('somethingWrong'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <div className="topbar">
        <button className="link-btn" onClick={() => navigate('/')}>
          ← {t('back')}
        </button>
        <LanguageSwitcher />
      </div>

      <div className="form-content">
        <h2>{t('addItemTitle')}</h2>

        <form onSubmit={handleSubmit}>
          <label>{t('itemNameLabel')}</label>
          <input
            type="text"
            value={name}
            placeholder={t('itemNamePlaceholder')}
            onChange={(e) => {
              setName(e.target.value)
              setSaved(false)
            }}
            required
          />

          <label>{t('itemDescriptionLabel')}</label>
          <textarea
            rows={3}
            value={description}
            placeholder={t('itemDescriptionPlaceholder')}
            onChange={(e) => {
              setDescription(e.target.value)
              setSaved(false)
            }}
          />

          <label>{t('itemLocationLabel')}</label>
          <input
            type="text"
            value={location}
            placeholder={t('itemLocationPlaceholder')}
            onChange={(e) => {
              setLocation(e.target.value)
              setSaved(false)
            }}
            required
          />

          {error && <p className="error">{error}</p>}
          {saved && <p className="success">{t('itemSaved')}</p>}

          <button type="submit" className="primary" disabled={busy}>
            {busy ? t('saving') : t('save')}
          </button>
        </form>
      </div>
    </div>
  )
}
