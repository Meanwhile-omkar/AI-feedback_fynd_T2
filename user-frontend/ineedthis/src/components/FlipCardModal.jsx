import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Star } from 'lucide-react'

export default function FlipCardModal({
  isOpen,
  onClose,
  response,
  rating
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  return createPortal(
    <div
      className="absolute inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4 sm:px-6"
      onClick={onClose}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[#111827] border border-white/20 ring-1 ring-purple-500/30 shadow-[0_40px_120px_rgba(0,0,0,0.9)] p-8">

        {/* Header */}
        <h2 className="text-3xl font-semibold text-white">
          Thank you for your feedback
        </h2>
        <p className="mt-2 text-gray-400">
          We read every submission carefully. Here’s how we’re responding.
        </p>

        {/* Rating */}
        <div className="mt-5 flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <Star
              key={i}
              size={22}
              className={
                i <= rating
                  ? 'text-purple-400 fill-purple-400'
                  : 'text-gray-600'
              }
            />
          ))}
        </div>

        {/* AI Response */}
        <div className="mt-6 rounded-xl bg-white/5 border border-white/10 p-5 text-sm text-gray-200 leading-relaxed max-h-[45vh] overflow-y-auto">
          {response}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 py-3 text-sm font-medium text-white hover:opacity-90 transition"
          >
            Submit another response
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  )
}
