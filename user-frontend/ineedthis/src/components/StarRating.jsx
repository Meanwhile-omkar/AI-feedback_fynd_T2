import { Star as StarOutline } from 'lucide-react'
import { Star as StarFilled } from 'lucide-react'

export default function StarRating({ rating, onRatingChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {[1, 2, 3, 4, 5].map(value => {
        const isActive = value <= rating

        return (
          <button
            key={value}
            type="button"
            onClick={() => onRatingChange(value)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer'
            }}
            aria-label={`Rate ${value} star`}
          >
            {isActive ? (
              <StarFilled
                size={22}
                style={{
                  color: '#a78bfa',
                  fill: '#a78bfa'
                }}
              />
            ) : (
              <StarOutline
                size={22}
                style={{
                  color: '#6b7280'
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
