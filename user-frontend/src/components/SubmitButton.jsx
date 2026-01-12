import React from 'react';
import { Loader2, Send } from 'lucide-react';

export default function SubmitButton({ isSubmitting, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isSubmitting}
      className="relative group w-full py-4 rounded-xl font-bold text-sm text-white transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-emerald-500 transition-transform group-hover:scale-105" />
      <div className="relative flex items-center justify-center gap-2">
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>Processing Feedback...</span>
          </>
        ) : (
          <>
            <span>Submit Feedback</span>
            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </div>
    </button>
  );
}