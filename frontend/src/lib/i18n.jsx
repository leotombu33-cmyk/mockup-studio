import { createContext, useContext, useEffect, useState } from 'react'

const dictionaries = {
  fr: {
    'nav.studio': 'Studio',
    'nav.gallery': 'Galerie',
    'hero.eyebrow': 'Studio photo IA pour vendeurs Etsy',
    'hero.title.1': 'Vos designs méritent',
    'hero.title.2': 'une vraie scène.',
    'hero.subtitle':
      'Uploadez votre carte, étiquette ou faire-part. En quinze secondes, notre IA le met en scène dans une photo professionnelle, prête à publier sur votre boutique.',
    'hero.cta': 'Créer mon premier mockup',
    'hero.badge': 'Propulsé par Gemini Nano Banana',
    'hero.caption.evjf': 'Soirée EVJF',
    'hero.caption.wedding': 'Table de mariage',
    'hero.caption.gift': 'Boîte cadeau',
    'studio.step1': 'Votre design',
    'studio.step1.sub': 'PNG, JPG, WEBP ou PDF — 25 Mo max',
    'studio.step2': 'Votre scène',
    'studio.step2.sub': 'Choisissez l’ambiance de la photo',
    'upload.title': 'Déposez votre design ici',
    'upload.hint': 'ou cliquez pour parcourir vos fichiers',
    'upload.replace': 'Cliquez pour remplacer',
    'upload.error.type': 'Format non pris en charge. Utilisez PNG, JPG, WEBP ou PDF.',
    'upload.error.size': 'Fichier trop volumineux (25 Mo maximum).',
    'scene.evjf.title': 'Soirée EVJF',
    'scene.evjf.desc': 'Coupes de champagne, confettis dorés, mains qui trinquent',
    'scene.wine.title': 'Dégustation vin',
    'scene.wine.desc': 'Table en bois, verres de rouge, lumière dorée',
    'scene.wedding.title': 'Table de mariage',
    'scene.wedding.desc': 'Roses blanches, vaisselle fine, lueur des bougies',
    'scene.gift.title': 'Boîte cadeau',
    'scene.gift.desc': 'Ruban satin, papier kraft, marbre blanc',
    'generate.button': 'Générer la photo',
    'generate.missing.file': 'Ajoutez d’abord votre design.',
    'generate.missing.scene': 'Choisissez une scène.',
    'generate.error': 'La génération a échoué. Réessayez dans un instant.',
    'darkroom.1': 'Préparation du studio…',
    'darkroom.2': 'Réglage de la lumière…',
    'darkroom.3': 'Mise au point…',
    'darkroom.4': 'Développement de votre photo…',
    'darkroom.note': 'Comptez 8 à 15 secondes',
    'result.title': 'Votre mockup est prêt',
    'result.download': 'Télécharger en HD',
    'result.close': 'Fermer',
    'result.again': 'Nouvelle scène',
    'gallery.title': 'Vos derniers mockups',
    'gallery.subtitle': 'Les 50 dernières photos générées dans le studio.',
    'gallery.empty.title': 'Votre galerie attend sa première photo',
    'gallery.empty.sub': 'Uploadez un design ci-dessus pour commencer.',
    'gallery.download': 'Télécharger',
    'gallery.delete': 'Supprimer',
    'gallery.deleted': 'Mockup supprimé.',
    'footer.tagline': 'Des photos produit dignes d’un magazine, sans studio.',
  },
  en: {
    'nav.studio': 'Studio',
    'nav.gallery': 'Gallery',
    'hero.eyebrow': 'AI photo studio for Etsy sellers',
    'hero.title.1': 'Your designs deserve',
    'hero.title.2': 'a real scene.',
    'hero.subtitle':
      'Upload your card, label or invitation. In fifteen seconds, our AI stages it in a professional photo, ready to publish on your shop.',
    'hero.cta': 'Create my first mockup',
    'hero.badge': 'Powered by Gemini Nano Banana',
    'hero.caption.evjf': 'Bachelorette party',
    'hero.caption.wedding': 'Wedding table',
    'hero.caption.gift': 'Gift box',
    'studio.step1': 'Your design',
    'studio.step1.sub': 'PNG, JPG, WEBP or PDF — 25 MB max',
    'studio.step2': 'Your scene',
    'studio.step2.sub': 'Pick the mood of the photo',
    'upload.title': 'Drop your design here',
    'upload.hint': 'or click to browse your files',
    'upload.replace': 'Click to replace',
    'upload.error.type': 'Unsupported format. Use PNG, JPG, WEBP or PDF.',
    'upload.error.size': 'File too large (25 MB maximum).',
    'scene.evjf.title': 'Bachelorette party',
    'scene.evjf.desc': 'Champagne coupes, gold confetti, hands toasting',
    'scene.wine.title': 'Wine tasting',
    'scene.wine.desc': 'Wooden table, red wine glasses, golden light',
    'scene.wedding.title': 'Wedding table',
    'scene.wedding.desc': 'White roses, fine china, candlelight',
    'scene.gift.title': 'Gift box',
    'scene.gift.desc': 'Satin ribbon, kraft paper, white marble',
    'generate.button': 'Generate the photo',
    'generate.missing.file': 'Add your design first.',
    'generate.missing.scene': 'Pick a scene.',
    'generate.error': 'Generation failed. Try again in a moment.',
    'darkroom.1': 'Setting up the studio…',
    'darkroom.2': 'Adjusting the light…',
    'darkroom.3': 'Finding focus…',
    'darkroom.4': 'Developing your photo…',
    'darkroom.note': 'Takes 8 to 15 seconds',
    'result.title': 'Your mockup is ready',
    'result.download': 'Download in HD',
    'result.close': 'Close',
    'result.again': 'New scene',
    'gallery.title': 'Your latest mockups',
    'gallery.subtitle': 'The last 50 photos generated in the studio.',
    'gallery.empty.title': 'Your gallery is waiting for its first photo',
    'gallery.empty.sub': 'Upload a design above to get started.',
    'gallery.download': 'Download',
    'gallery.delete': 'Delete',
    'gallery.deleted': 'Mockup deleted.',
    'footer.tagline': 'Magazine-grade product photos, no studio required.',
  },
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('mockup-studio-lang')
    return saved === 'en' || saved === 'fr' ? saved : 'fr'
  })

  useEffect(() => {
    localStorage.setItem('mockup-studio-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = (key) => dictionaries[lang][key] ?? key

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
