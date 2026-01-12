import React, { useState } from 'react';
import { Sparkles, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import StarRating from './components/StarRating';
import SubmitButton from './components/SubmitButton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    city: '', 
    rating: 0, 
    review: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    // Compulsory Fields
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    // Review is Optional - No validation needed here

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        rating: parseInt(formData.rating),
        review: formData.review.trim() || "" // Handle empty review gracefully
      };

      const response = await fetch(`${API_URL}/api/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.ai_response);
        setIsFlipped(true);
      } else {
        setErrors({ submit: "Failed to submit. Please try again." });
      }
    } catch (err) {
      setErrors({ submit: "Network error. Is the server running?" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsFlipped(false);
    setFormData({ name: '', email: '', city: '', rating: 0, review: '' });
    setAiResponse('');
    setErrors({});
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 py-12">
      {/* 
          Increased width to max-w-lg and set a stable min-height 
          to ensure the glass card covers everything 
      */}
      <div className="w-full max-w-lg perspective-1000">
        <div className={`relative transition-all duration-[800ms] preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* FRONT SIDE */}
          <div className="backface-hidden glass-card inner-glow rounded-[2.5rem] p-8 md:p-10 flex flex-col shadow-2xl border border-white/10">
            <header className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                <Sparkles size={14} className="text-purple-400" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300">Feedback Portal</span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                How are we doing?
              </h1>
            </header>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Name <span className="text-purple-400">*</span></label>
                <input 
                  className={`input-field ${errors.name ? 'border-red-500/50' : ''}`}
                  placeholder="Enter your full name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
                {errors.name && <p className="text-[10px] text-red-400 ml-1">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email <span className="text-purple-400">*</span></label>
                <input 
                  className={`input-field ${errors.email ? 'border-red-500/50' : ''}`}
                  placeholder="email@example.com" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                />
                {errors.email && <p className="text-[10px] text-red-400 ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">City <span className="text-purple-400">*</span></label>
                <input 
                  className={`input-field ${errors.city ? 'border-red-500/50' : ''}`}
                  placeholder="e.g. Mumbai" 
                  value={formData.city} 
                  onChange={e => setFormData({...formData, city: e.target.value})} 
                />
                {errors.city && <p className="text-[10px] text-red-400 ml-1">{errors.city}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Rating <span className="text-purple-400">*</span></label>
                <StarRating rating={formData.rating} onRatingChange={r => setFormData({...formData, rating: r})} />
                {errors.rating && <p className="text-[10px] text-red-400 ml-1">{errors.rating}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Review</label>
                <textarea 
                  rows={4} 
                  className="input-field resize-none"
                  placeholder="Share your thoughts (optional)" 
                  value={formData.review} 
                  onChange={e => setFormData({...formData, review: e.target.value})} 
                />
              </div>
            </div>

            <div className="mt-10">
              <SubmitButton isSubmitting={isSubmitting} onClick={handleSubmit} />
              {errors.submit && <p className="text-red-400 text-center text-xs mt-3 font-medium">{errors.submit}</p>}
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card inner-glow rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between border border-white/10 shadow-2xl">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-8 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <CheckCircle2 size={35} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Thank You!</h2>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed">
                Hi {formData.name.split(' ')[0] || 'there'}, we've processed your feedback.
              </p>

              <div className="relative p-6 rounded-3xl bg-white/[0.03] border border-white/10 ai-shimmer overflow-hidden">
                <div className="flex items-center gap-2 mb-4 text-purple-400">
                  <MessageSquare size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">AI Response</span>
                </div>
                <p className="text-[15px] text-slate-200 leading-relaxed italic relative z-10">
                  "{aiResponse || 'Analyzing your feedback...'}"
                </p>
                {/* Visual flare for the AI box */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-3xl rounded-full" />
              </div>
            </div>

            <button 
              onClick={handleReset}
              className="
                        relative mt-8 w-full py-4 rounded-2xl overflow-hidden
                        bg-gradient-to-r from-purple-600 to-emerald-500
                        text-white text-xs font-bold uppercase tracking-[0.28em]
                        transition-all duration-300
                        before:absolute before:inset-0
                        before:bg-white/10 before:opacity-0
                        hover:before:opacity-100
                        hover:shadow-[0_16px_40px_-14px_rgba(147,51,234,0.6)]
                        active:scale-[0.97]
                        "
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

export default App;