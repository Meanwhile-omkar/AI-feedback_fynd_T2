import React, { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import FlipCardModal from './components/FlipCardModal'
import StarRating from './components/StarRating'
import SubmitButton from './components/SubmitButton'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    rating: 0,
    review: ''
  })

  const [submittedRating, setSubmittedRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [reviewId, setReviewId] = useState('')
  const [errors, setErrors] = useState({})

  // Lock page scroll while modal is open (add this inside component)
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    // cleanup on unmount
    return () => {
      document.body.style.overflow = ''
    }
  }, [showModal])

  const validateForm = () => {
    const newErrors = {}

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating'
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = 'Please enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch(`${API_URL}/api/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      const data = await response.json()

      // snapshot rating for modal visuals
      setSubmittedRating(formData.rating)
      setAiResponse(data.ai_response)
      setReviewId(data.id)
      setShowModal(true)

      // reset form for next entry
      setFormData({
        name: '',
        email: '',
        city: '',
        rating: 0,
        review: ''
      })
    } catch (error) {
      setErrors({
        submit: 'Failed to submit feedback. Please try again.'
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  return (
    <>
    <div
      className={`min-h-screen flex items-center justify-center px-6 py-12 ${
        showModal ? 'pointer-events-none' : ''
      }`}
    >
      <div className="card w-full max-w-2xl">
        {/* header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full bg-white/3 border border-white/8">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-xs text-gray-300">Product Feedback</span>
          </div>

          <h1 className="text-3xl font-semibold">Review Our Product</h1>
          <p className="subtitle mt-2 max-w-xl mx-auto">
            Your feedback helps us improve — short, honest thoughts are
            appreciated.
          </p>
        </div>

        

        {/* form grid */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name <span className="text-sm text-gray-400">(optional)</span></label>
              <input
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="John Doe"
                className="input"
              />
            </div>

            <div>
              <label className="label">Email <span className="text-sm text-gray-400">(optional)</span></label>
              <input
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="john@company.com"
                className={`input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="label">City <span className="text-sm text-gray-400">(optional)</span></label>
            <input
              value={formData.city}
              onChange={e => handleChange('city', e.target.value)}
              placeholder="Mumbai"
              className="input"
            />
          </div>

          <div>
            <label className="label">Rating <span className="text-red-400">*</span></label>
            <StarRating
              rating={formData.rating}
              onRatingChange={rating => handleChange('rating', rating)}
            />
            {errors.rating && <p className="text-sm text-red-400 mt-1">{errors.rating}</p>}
          </div>

          <div>
            <label className="label">Your Review <span className="text-sm text-gray-400">(optional)</span></label>
            <textarea
              rows={5}
              maxLength={800}
              value={formData.review}
              onChange={e => handleChange('review', e.target.value)}
              placeholder="Share your experience, suggestions, or concerns..."
              className="textarea"
            />
            <div className="text-xs text-gray-400 mt-1 text-right">{formData.review.length} / 800</div>
          </div>

          <div>
            <SubmitButton isSubmitting={isSubmitting} onClick={handleSubmit} />
            {errors.submit && <p className="text-sm text-red-400 mt-2">{errors.submit}</p>}
          </div>
        </div>
      </div>
    </div>

    {/* modal overlay */}
    <FlipCardModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      response={aiResponse}
      rating={submittedRating}
    />
  </>
  )
}

export default App
