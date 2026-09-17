import { useTranslation } from 'react-i18next'

// Two small buttons to switch between English and Greek.
// The choice is saved so it is remembered next time.
export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
  }

  const current = i18n.language

  return (
    <div className="lang-switcher">
      <button
        type="button"
        className={current.startsWith('en') ? 'active' : ''}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={current.startsWith('el') ? 'active' : ''}
        onClick={() => changeLanguage('el')}
      >
        ΕΛ
      </button>
    </div>
  )
}
