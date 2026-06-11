import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Camera, Download, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '../lib/i18n.jsx'
import { deleteMockup } from '../lib/api.js'

async function downloadImage(url, filename) {
  const response = await fetch(url)
  const blob = await response.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export default function Gallery({ mockups, onDeleted }) {
  const { t, lang } = useI18n()
  const reduced = useReducedMotion()

  const handleDelete = async (id) => {
    try {
      await deleteMockup(id)
      toast.success(t('gallery.deleted'))
      onDeleted(id)
    } catch {
      toast.error(t('generate.error'))
    }
  }

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-6 pb-28 pt-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl">{t('gallery.title')}</h2>
          <p className="mt-1.5 text-sm text-mute">{t('gallery.subtitle')}</p>
        </div>
      </div>

      {mockups.length === 0 ? (
        <div
          className="flex flex-col items-center rounded-card border border-dashed border-veil bg-paper/60 px-6 py-16 text-center"
          data-testid="gallery-empty"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-mute">
            <Camera className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 font-display text-lg">{t('gallery.empty.title')}</p>
          <p className="mt-1 text-sm text-mute">{t('gallery.empty.sub')}</p>
        </div>
      ) : (
        <motion.div
          layout={!reduced}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          data-testid="gallery-grid"
        >
          <AnimatePresence>
            {mockups.map((m) => {
              const title = lang === 'fr' ? m.scene_title_fr : m.scene_title_en
              return (
                <motion.figure
                  key={m.id}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative overflow-hidden rounded-card bg-paper shadow-soft"
                  data-testid="gallery-item"
                >
                  <img
                    src={m.image_url}
                    alt={title}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-ink/70 to-transparent p-3 opacity-0 transition-opacity duration-300 focus-within:opacity-100 group-hover:opacity-100">
                    <span className="truncate font-display text-sm italic text-linen">
                      {title}
                    </span>
                    <span className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        aria-label={t('gallery.download')}
                        data-testid="gallery-download"
                        onClick={() =>
                          downloadImage(m.image_url, `mockup-${m.scene_id}-${m.id}.png`)
                        }
                        className="rounded-full bg-linen/90 p-2 text-ink transition-colors hover:bg-linen focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label={t('gallery.delete')}
                        data-testid="gallery-delete"
                        onClick={() => handleDelete(m.id)}
                        className="rounded-full bg-linen/90 p-2 text-brand-deep transition-colors hover:bg-linen focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </span>
                  </figcaption>
                </motion.figure>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}
