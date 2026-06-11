import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'

async function downloadImage(url, filename) {
  const response = await fetch(url)
  const blob = await response.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export default function ResultModal({ mockup, onClose, onAgain }) {
  const { t, lang } = useI18n()
  const reduced = useReducedMotion()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const title = lang === 'fr' ? mockup.scene_title_fr : mockup.scene_title_en

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('result.title')}
      data-testid="result-modal"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-card bg-paper shadow-lift"
      >
        <div className="flex items-center justify-between border-b border-veil px-6 py-4">
          <div>
            <p className="font-display text-lg">{t('result.title')}</p>
            <p className="text-xs uppercase tracking-wide text-mute">{title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="result-close"
            aria-label={t('result.close')}
            className="rounded-full p-2 text-mute transition-colors hover:bg-sand hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="bg-sand p-6">
          {/* Révélation façon développement photo : flou + surexposition → net */}
          <motion.img
            src={mockup.image_url}
            alt={title}
            initial={
              reduced
                ? false
                : { opacity: 0, filter: 'blur(14px) brightness(1.3)' }
            }
            animate={{ opacity: 1, filter: 'blur(0px) brightness(1)' }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="mx-auto max-h-[55vh] rounded-xl shadow-lift"
            data-testid="result-image"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 px-6 py-4">
          <button
            type="button"
            onClick={onAgain}
            data-testid="result-again"
            className="rounded-full border border-veil px-5 py-2.5 text-sm text-mute transition-colors hover:border-ink hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {t('result.again')}
          </button>
          <button
            type="button"
            data-testid="download-button"
            onClick={() =>
              downloadImage(mockup.image_url, `mockup-${mockup.scene_id}-${mockup.id}.png`)
            }
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-linen shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-deep"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t('result.download')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
