import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, ImageUp } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '../lib/i18n.jsx'

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
const MAX_SIZE = 25 * 1024 * 1024

export default function UploadZone({ file, onFile }) {
  const { t } = useI18n()
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState(null)

  const accept = (candidate) => {
    if (!candidate) return
    if (!ACCEPTED.includes(candidate.type)) {
      toast.error(t('upload.error.type'))
      return
    }
    if (candidate.size > MAX_SIZE) {
      toast.error(t('upload.error.size'))
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setPreview(candidate.type === 'application/pdf' ? null : URL.createObjectURL(candidate))
    onFile(candidate)
  }

  return (
    <motion.button
      type="button"
      data-testid="upload-zone"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        accept(e.dataTransfer.files?.[0])
      }}
      whileTap={{ scale: 0.995 }}
      className={`group relative w-full overflow-hidden rounded-card border-2 border-dashed bg-paper p-6 text-left shadow-soft transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
        dragging ? 'border-brand bg-brand/5' : 'border-veil hover:border-brand/50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        data-testid="file-input"
        onChange={(e) => accept(e.target.files?.[0])}
      />

      {file ? (
        <div className="flex items-center gap-5">
          {preview ? (
            <img
              src={preview}
              alt=""
              className="h-24 w-24 rounded-xl border border-veil object-cover"
            />
          ) : (
            <span className="flex h-24 w-24 items-center justify-center rounded-xl border border-veil bg-sand text-brand">
              <FileText className="h-8 w-8" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium" data-testid="upload-filename">
              {file.name}
            </p>
            <p className="mt-0.5 text-sm text-mute">
              {(file.size / 1024 / 1024).toFixed(1)} Mo
            </p>
            <p className="mt-2 text-xs uppercase tracking-wide text-brand">
              {t('upload.replace')}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-brand transition-transform duration-300 group-hover:-translate-y-1">
            <ImageUp className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 font-display text-lg">{t('upload.title')}</p>
          <p className="mt-1 text-sm text-mute">{t('upload.hint')}</p>
        </div>
      )}
    </motion.button>
  )
}
