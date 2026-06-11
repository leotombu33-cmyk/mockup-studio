import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import { SCENE_BY_ID } from '../lib/scenes.js'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

function MoodCard({ sceneId, caption, rotation, delay, reduced }) {
  const scene = SCENE_BY_ID[sceneId]
  return (
    <motion.figure
      initial={reduced ? false : { opacity: 0, y: 32, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { y: -8, transition: { duration: 0.3 } }}
      className="w-36 shrink-0 rounded-card bg-paper p-2 pb-3 shadow-lift sm:w-44"
      style={{ rotate: rotation }}
    >
      <div
        className="flex aspect-[3/4] items-end justify-start rounded-xl p-3 text-2xl"
        style={{ backgroundImage: scene.gradient }}
      >
        <span aria-hidden="true">{scene.emoji}</span>
      </div>
      <figcaption className="mt-2 px-1 font-display text-sm italic text-mute">
        {caption}
      </figcaption>
    </motion.figure>
  )
}

export default function Hero() {
  const { t } = useI18n()
  const reduced = useReducedMotion()

  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.p
            variants={fadeUp}
            initial={reduced ? false : 'hidden'}
            animate="show"
            className="text-xs font-medium uppercase tracking-[0.2em] text-brand"
          >
            {t('hero.eyebrow')}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial={reduced ? false : 'hidden'}
            animate="show"
            custom={0.1}
            className="mt-5 font-display text-4xl leading-[1.1] sm:text-6xl"
          >
            {t('hero.title.1')}
            <br />
            <em className="text-brand">{t('hero.title.2')}</em>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial={reduced ? false : 'hidden'}
            animate="show"
            custom={0.2}
            className="mt-6 max-w-xl text-lg font-light leading-relaxed text-mute"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial={reduced ? false : 'hidden'}
            animate="show"
            custom={0.3}
            className="mt-9 flex flex-wrap items-center gap-5"
          >
            <a
              href="#studio"
              data-testid="hero-cta"
              className="rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-linen shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lift"
            >
              {t('hero.cta')}
            </a>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-veil bg-paper px-4 py-2 text-xs text-mute">
              <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              {t('hero.badge')}
            </span>
          </motion.div>
        </div>

        <div className="flex justify-center gap-4 lg:justify-end" aria-hidden="true">
          <MoodCard sceneId="evjf" caption={t('hero.caption.evjf')} rotation={-5} delay={0.2} reduced={reduced} />
          <MoodCard sceneId="wedding" caption={t('hero.caption.wedding')} rotation={3} delay={0.35} reduced={reduced} />
          <MoodCard sceneId="gift" caption={t('hero.caption.gift')} rotation={-1} delay={0.5} reduced={reduced} />
        </div>
      </div>
    </section>
  )
}
