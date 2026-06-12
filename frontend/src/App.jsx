import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Wand2 } from 'lucide-react'
import { toast } from 'sonner'

import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import UploadZone from './components/UploadZone.jsx'
import SceneSelector from './components/SceneSelector.jsx'
import DarkroomLoader from './components/DarkroomLoader.jsx'
import ResultModal from './components/ResultModal.jsx'
import Gallery from './components/Gallery.jsx'
import GrainOverlay from './components/GrainOverlay.jsx'

import { useI18n } from './lib/i18n.jsx'
import { generateMockup, listMockups } from './lib/api.js'

function StepHeading({ number, title, subtitle }) {
  return (
    <div className="mb-5 flex items-baseline gap-3">
      <span className="font-display text-sm italic text-brand">{number}</span>
      <div>
        <h3 className="font-display text-xl">{title}</h3>
        <p className="text-sm text-mute">{subtitle}</p>
      </div>
    </div>
  )
}

export default function App() {
  const { t } = useI18n()
  const reduced = useReducedMotion()

  const [file, setFile] = useState(null)
  const [sceneId, setSceneId] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [mockups, setMockups] = useState([])

  const refreshGallery = useCallback(() => {
    listMockups()
      .then(setMockups)
      .catch(() => {})
  }, [])

  useEffect(() => {
    refreshGallery()
  }, [refreshGallery])

  const handleGenerate = async () => {
    if (!file) return toast.error(t('generate.missing.file'))
    if (!sceneId) return toast.error(t('generate.missing.scene'))

    setGenerating(true)
    try {
      const mockup = await generateMockup(file, sceneId)
      setResult(mockup)
      refreshGallery()
    } catch {
      toast.error(t('generate.error'))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen">
      <GrainOverlay />
      <Header />
      <main>
        <Hero />

        <Marquee />

        <section id="studio" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-card border border-veil bg-paper/70 p-6 shadow-soft sm:p-10"
          >
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <StepHeading
                  number="I."
                  title={t('studio.step1')}
                  subtitle={t('studio.step1.sub')}
                />
                <UploadZone file={file} onFile={setFile} />
              </div>
              <div>
                <StepHeading
                  number="II."
                  title={t('studio.step2')}
                  subtitle={t('studio.step2.sub')}
                />
                <SceneSelector selected={sceneId} onSelect={setSceneId} />
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                data-testid="generate-button"
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2.5 rounded-full bg-ink px-9 py-4 text-sm font-medium text-linen shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:translate-y-0 disabled:opacity-50"
              >
                <Wand2 className="h-4 w-4 text-brand" aria-hidden="true" />
                {t('generate.button')}
              </button>
            </div>
          </motion.div>
        </section>

        <Gallery
          mockups={mockups}
          onDeleted={(id) => setMockups((list) => list.filter((m) => m.id !== id))}
        />
      </main>

      <footer className="border-t border-veil/60 py-10 text-center">
        <p className="font-display text-sm italic text-mute">{t('footer.tagline')}</p>
      </footer>

      <AnimatePresence>{generating && <DarkroomLoader />}</AnimatePresence>
      <AnimatePresence>
        {result && (
          <ResultModal
            mockup={result}
            onClose={() => setResult(null)}
            onAgain={() => {
              setResult(null)
              setSceneId(null)
              document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
