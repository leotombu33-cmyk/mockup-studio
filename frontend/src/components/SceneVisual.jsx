import { useState } from 'react'

/**
 * Visuel d'une scène : affiche la vraie photo (frontend/public/scenes/<id>.jpg)
 * si elle existe, sinon retombe sur le dégradé d'ambiance — jamais d'image cassée.
 */
export default function SceneVisual({ scene, className = '', children }) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: scene.gradient }}
    >
      {!failed && (
        <img
          src={scene.photo}
          alt=""
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      {children}
    </div>
  )
}
