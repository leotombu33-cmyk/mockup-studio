import { useI18n } from '../lib/i18n.jsx'

export default function Header() {
  const { lang, setLang, t } = useI18n()

  return (
    <header className="sticky top-0 z-40 border-b border-veil/60 bg-linen/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-xl tracking-tight" data-testid="logo">
          Mockup <span className="italic text-brand">Studio</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-mute sm:flex">
          <a href="#studio" className="transition-colors hover:text-ink" data-testid="nav-studio">
            {t('nav.studio')}
          </a>
          <a href="#gallery" className="transition-colors hover:text-ink" data-testid="nav-gallery">
            {t('nav.gallery')}
          </a>
        </nav>

        <div
          className="flex items-center rounded-full border border-veil bg-paper p-0.5 text-xs font-medium"
          data-testid="lang-switcher"
          role="group"
          aria-label="Language"
        >
          {['fr', 'en'].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              data-testid={`lang-${code}`}
              aria-pressed={lang === code}
              className={`rounded-full px-3 py-1.5 uppercase tracking-wide transition-all duration-300 ${
                lang === code ? 'bg-ink text-linen shadow-soft' : 'text-mute hover:text-ink'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
