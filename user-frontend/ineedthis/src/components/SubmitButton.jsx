import React from 'react'
import { Loader2 } from 'lucide-react'

export default function SubmitButton({ isSubmitting, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isSubmitting}
      className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-emerald-400 hover:from-purple-600 hover:to-emerald-500 transition"
    >
      {isSubmitting ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="animate-spin" size={16} /> Submitting...
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">Submit Feedback</span>
      )}
    </button>
  )
}
