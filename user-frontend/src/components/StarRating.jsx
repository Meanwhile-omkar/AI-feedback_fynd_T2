import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, onRatingChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hover || rating);
        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onRatingChange(star)}
            className="transition-transform active:scale-90 hover:scale-110"
          >
            <Star
              size={28}
              strokeWidth={1.5}
              className={`transition-all duration-300 ${
                active 
                  ? 'text-purple-400 fill-purple-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]' 
                  : 'text-slate-600 fill-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}