import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

export default function FindItem() {
  const { t } = useTranslation()
  const { items, deleteItem } = useAuth()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [confirming, setConfirming] = useState(false) // show delete confirmation
  const [deletedMsg, setDeletedMsg] = useState(false)

  const handleConfirmDelete = async () => {
    await deleteItem(selected.id)
    setConfirming(false)
    setSelected(null)
    setQuery('')
    setDeletedMsg(true)
  }

  // Filter as the user types. We match against name AND description, so a few
  // words from the description will surface the item too.
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const words = q.split(/\s+/)
    return items
      .filter((item) => {
        const haystack = `${item.name} ${item.description}`.toLowerCase()
        return words.every((word) => haystack.includes(word))
      })
      .slice(0, 8)
  }, [query, items])

  const handleSelect = (item) => {
    setSelected(item)
    setQuery(item.name)
    setDeletedMsg(false)
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
        <h2>{t('findItemTitle')}</h2>

        <div className="search-wrap">
          <input
            type="text"
            value={query}
            placeholder={t('searchPlaceholder')}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelected(null)
              setDeletedMsg(false)
            }}
            autoFocus
          />

          {/* Autocomplete dropdown */}
          {query.trim() && !selected && (
            <ul className="autocomplete">
              {matches.length > 0 ? (
                matches.map((item) => (
                  <li key={item.id} onClick={() => handleSelect(item)}>
                    <strong>{item.name}</strong>
                    {item.description && (
                      <span className="hint"> — {item.description}</span>
                    )}
                  </li>
                ))
              ) : (
                <li className="disabled">{t('noResults')}</li>
              )}
            </ul>
          )}
        </div>

        {/* Result: the stored location of the selected item */}
        {selected && (
          <div className="result-card">
            <h3>{selected.name}</h3>
            {selected.description && (
              <p className="muted">{selected.description}</p>
            )}
            <p className="location-label">{t('storedIn')}:</p>
            <p className="location-value">{selected.location}</p>

            <button
              type="button"
              className="danger"
              onClick={() => setConfirming(true)}
            >
              {t('delete')}
            </button>
          </div>
        )}

        {deletedMsg && <p className="success center">{t('itemDeleted')}</p>}

        {!query.trim() && !selected && !deletedMsg && (
          <p className="muted center">{t('startTyping')}</p>
        )}
      </div>

      {/* Confirmation dialog before deleting */}
      {confirming && selected && (
        <div className="modal-overlay" onClick={() => setConfirming(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('confirmDeleteTitle')}</h3>
            <p className="muted">
              {t('confirmDeleteMessage', { name: selected.name })}
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setConfirming(false)}
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                className="danger"
                onClick={handleConfirmDelete}
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
