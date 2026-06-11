// Métadonnées visuelles des scènes (côté front uniquement).
// Les dégradés évoquent l'ambiance de chaque scène sans avoir besoin de photos.
export const SCENES = [
  {
    id: 'evjf',
    emoji: '🥂',
    gradient: 'linear-gradient(150deg, #F7DCD4 0%, #EEC3B5 45%, #D9A06B 100%)',
  },
  {
    id: 'wine',
    emoji: '🍷',
    gradient: 'linear-gradient(150deg, #E8CFA8 0%, #B96A4B 55%, #6E2F33 100%)',
  },
  {
    id: 'wedding',
    emoji: '💒',
    gradient: 'linear-gradient(150deg, #FBF8F2 0%, #EFE6D8 50%, #D9CDBA 100%)',
  },
  {
    id: 'gift',
    emoji: '🎁',
    gradient: 'linear-gradient(150deg, #F4F1ED 0%, #E2D9D2 50%, #C9B8AC 100%)',
  },
]

export const SCENE_BY_ID = Object.fromEntries(SCENES.map((s) => [s.id, s]))
