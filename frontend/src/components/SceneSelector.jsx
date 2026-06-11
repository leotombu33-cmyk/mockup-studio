import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import { SCENES } from '../lib/scenes.js'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function SceneSelector({ selected, onSelect }) {
  const { t } = useI18n()
  const reduced = useReducedMotion()

  return (
    <motion.div
      variants={container}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className="grid grid-cols-2 gap-4"
      role="radiogroup"
      aria-label={t('studio.step2')}
    >
      {SCENES.map((scene) => {
        const active = selected === scene.id
        return (
          <motion.button
            key={scene.id}
            type="button"
            variants={item}
            data-testid={`scene-card-${scene.id}`}
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(scene.id)}
            whileHover={reduced ? undefined : { y: -4 }}
            transition={{ duration: 0.25 }}
            className={`relative overflow-hidden rounded-card bg-paper p-2 pb-3 text-left shadow-soft transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              active ? 'ring-2 ring-brand shadow-lift' : 'hover:shadow-lift'
            }`}
          >
            <div
              className="flex aspect-[4/3] items-end rounded-xl p-3 text-xl"
              style={{ backgroundImage: scene.gradient }}
            >
              <span aria-hidden="true">{scene.emoji}</span>
            </div>
            <div className="px-1.5 pt-2.5">
              <p className="font-display text-base leading-snug">
                {t(`scene.${scene.id}.title`)}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-mute">
                {t(`scene.${scene.id}.desc`)}
              </p>
            </div>
            {active && (
              <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-linen shadow-soft">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
