import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useI18n } from '../lib/i18n.jsx'

const PHASES = ['darkroom.1', 'darkroom.2', 'darkroom.3', 'darkroom.4']

/**
 * Pendant les 8-15 s de génération, l'interface devient une chambre noire :
 * fond encre, lueur ambrée qui respire, phrases de développement qui défilent.
 */
export default function DarkroomLoader() {
  const { t } = useI18n()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timer = setInterval(
      () => setPhase((p) => Math.min(p + 1, PHASES.length - 1)),
      3200
    )
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      data-testid="darkroom-loader"
    >
      <div className="relative flex flex-col items-center px-6 text-center">
        {/* Lueur ambrée qui respire, comme une lampe de chambre noire */}
        <motion.div
          aria-hidden="true"
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 h-56 w-56 rounded-full bg-brand blur-3xl"
        />

        <div className="relative h-20 w-16 overflow-hidden rounded-md border border-linen/20 bg-linen/5">
          <motion.div
            aria-hidden="true"
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-full bg-gradient-to-b from-transparent via-brand/40 to-transparent"
          />
        </div>

        <div className="relative mt-8 h-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="font-display text-xl italic text-linen"
            >
              {t(PHASES[phase])}
            </motion.p>
          </AnimatePresence>
        </div>

        <p className="relative mt-3 text-xs uppercase tracking-[0.2em] text-linen/40">
          {t('darkroom.note')}
        </p>
      </div>
    </motion.div>
  )
}
