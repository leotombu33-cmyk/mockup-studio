import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import { SCENE_BY_ID } from '../lib/scenes.js'
import SceneVisual from './SceneVisual.jsx'

function RevealWords({ text, delay = 0, reduced }) {
  return text.split(' ').map((word, i) => (
    <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-baseline">
      <motion.span
        className="inline-block"
        initial={reduced ? false : { y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.75, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
      >
        {word}
      </motion.span>
      {i < text.split(' ').length - 1 ? '\u00A0' : ''}
    </span>
  ))
}

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
      initial={reduced ? false : { opacity: 0, y: 60, rotate: rotation * 2.5, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: [0, -7, 0],
        rotate: rotation,
        scale: 1,
        transition: {
          opacity: { duration: 0.7, delay },
          rotate: { type: 'spring', stiffness: 60, damping: 12, delay },
          scale: { duration: 0.7, delay },
          y: reduced
            ? { duration: 0 }
            : { duration: 5.5, delay: delay + 1, repeat: Infinity, ease: 'easeInOut' },
        },
      }}
      whileHover={
        reduced ? undefined : { scale: 1.05, rotate: 0, zIndex: 10, transition: { duration: 0.35 } }
      }
      className="group w-36 shrink-0 cursor-default rounded-card bg-paper p-2 pb-3 shadow-lift sm:w-44"
    >
      <SceneVisual scene={scene} className="flex aspect-[3/4] items-end justify-start rounded-xl p-3 text-2xl">
        <span className="relative" aria-hidden="true">{scene.emoji}</span>
      </SceneVisual>
      <figcaption className="mt-2 px-1 font-display text-sm italic text-mute">
        {caption}
      </figcaption>
    </motion.figure>
  )
}

export default function Hero() {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const slow = useTransform(scrollY, [0, 600], [0, -30])
  const medium = useTransform(scrollY, [0, 600], [0, -70])
  const fast = useTransform(scrollY, [0, 600], [0, -110])

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

          <h1 className="mt-5 font-display text-4xl leading-[1.08] sm:text-6xl lg:text-7xl">
            <RevealWords text={t('hero.title.1')} delay={0.15} reduced={reduced} />
            <br />
            <em className="text-brand">
              <RevealWords text={t('hero.title.2')} delay={0.5} reduced={reduced} />
            </em>
          </h1>

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
          <motion.div style={reduced ? undefined : { y: slow }}>
            <MoodCard sceneId="evjf" caption={t('hero.caption.evjf')} rotation={-5} delay={0.2} reduced={reduced} />
          </motion.div>
          <motion.div style={reduced ? undefined : { y: fast }}>
            <MoodCard sceneId="wedding" caption={t('hero.caption.wedding')} rotation={3} delay={0.35} reduced={reduced} />
          </motion.div>
          <motion.div style={reduced ? undefined : { y: medium }}>
            <MoodCard sceneId="gift" caption={t('hero.caption.gift')} rotation={-1} delay={0.5} reduced={reduced} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
