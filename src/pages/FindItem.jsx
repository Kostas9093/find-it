import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

export default function FindItem() {
  const { t } = useTranslation()
  const { items, updateItem, deleteItem } = useAuth()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [confirming, setConfirming] = useState(false) // show delete confirmation
  const [deletedMsg, setDeletedMsg] = useState(false)
  const [updatedMsg, setUpdatedMsg] = useState(false)

  // Edit state: the modal form fields + status.
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editError, setEditError] = useState('')
  const [editBusy, setEditBusy] = useState(false)

  const handleConfirmDelete = async () => {
    await deleteItem(selected.id)
    setConfirming(false)
    setSelected(null)
    setQuery('')
    setDeletedMsg(true)
  }

  // Open the edit modal pre-filled with the selected item's current values.
  const openEdit = () => {
    setEditName(selected.name)
    setEditDescription(selected.description || '')
    setEditLocation(selected.location)
    setEditError('')
    setEditing(true)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    setEditError('')

    if (!editName.trim() || !editLocation.trim()) {
      setEditError(t('required'))
      return
    }

    try {
      setEditBusy(true)
      const updates = {
        name: editName.trim(),
        description: editDescription.trim(),
        location: editLocation.trim(),
      }
      await updateItem(selected.id, updates)
      // Reflect the changes in the currently shown card + search box.
      setSelected({ ...selected, ...updates })
      setQuery(updates.name)
      setEditing(false)
      setUpdatedMsg(true)
    } catch {
      setEditError(t('somethingWrong'))
    } finally {
      setEditBusy(false)
    }
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
    setUpdatedMsg(false)
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
              setUpdatedMsg(false)
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

            <div className="card-actions">
              <button type="button" className="edit-btn" onClick={openEdit}>
                {t('edit')}
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => setConfirming(true)}
              >
                {t('delete')}
              </button>
            </div>
          </div>
        )}

        {updatedMsg && <p className="success center">{t('itemUpdated')}</p>}
        {deletedMsg && <p className="success center">{t('itemDeleted')}</p>}

        {!query.trim() && !selected && !deletedMsg && (
          <p className="muted center">{t('startTyping')}</p>
        )}
      </div>

      {/* Edit dialog */}
      {editing && selected && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('editItemTitle')}</h3>

            <form onSubmit={handleSaveEdit}>
              <label>{t('itemNameLabel')}</label>
              <input
                type="text"
                value={editName}
                placeholder={t('itemNamePlaceholder')}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
                required
              />

              <label>{t('itemDescriptionLabel')}</label>
              <textarea
                rows={3}
                value={editDescription}
                placeholder={t('itemDescriptionPlaceholder')}
                onChange={(e) => setEditDescription(e.target.value)}
              />

              <label>{t('itemLocationLabel')}</label>
              <input
                type="text"
                value={editLocation}
                placeholder={t('itemLocationPlaceholder')}
                onChange={(e) => setEditLocation(e.target.value)}
                required
              />

              {editError && <p className="error">{editError}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setEditing(false)}
                  disabled={editBusy}
                >
                  {t('cancel')}
                </button>
                <button type="submit" className="primary" disabled={editBusy}>
                  {editBusy ? t('loading') : t('saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
