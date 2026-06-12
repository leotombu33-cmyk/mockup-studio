import { useI18n } from '../lib/i18n.jsx'

/**
 * Bandeau défilant façon magazine — les noms de scènes et les promesses
 * du produit qui glissent en continu entre le hero et le studio.
 */
export default function Marquee() {
  const { t } = useI18n()

  const items = [
    t('scene.evjf.title'),
    t('marquee.1'),
    t('scene.wine.title'),
    t('marquee.2'),
    t('scene.wedding.title'),
    t('marquee.3'),
    t('scene.gift.title'),
    t('marquee.4'),
  ]

  const Track = ({ hidden }) => (
    <div className="marquee-track flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-display text-lg italic text-ink/80 sm:text-xl">
            {item}
          </span>
          <span className="text-sm text-brand" aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="overflow-hidden border-y border-veil/70 bg-paper/60 py-4">
      <div className="marquee-rail flex w-max">
        <Track />
        <Track hidden />
      </div>
    </div>
  )
}
