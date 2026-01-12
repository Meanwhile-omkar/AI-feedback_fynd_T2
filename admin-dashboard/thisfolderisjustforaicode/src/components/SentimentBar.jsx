import React from 'react';

function SentimentBar({ avgRating, totalReviews }) {
  const sentimentScore = ((avgRating - 1) / 4) * 100; // Convert to 0-100 scale
  
  const getColor = () => {
    if (avgRating <= 2.5) return '#FF5A6A';
    if (avgRating <= 3.5) return '#FFB86B';
    return '#22FFB0';
  };

  const getSentimentLabel = () => {
    if (avgRating <= 2.5) return 'Needs Attention';
    if (avgRating <= 3.5) return 'Neutral';
    return 'Positive';
  };

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-3xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Sentiment Health</h3>
          <p className="text-sm text-gray-400">
            Real-time customer sentiment analysis
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{avgRating.toFixed(2)}</div>
          <div className="text-sm text-gray-400">Average Rating</div>
        </div>
      </div>
      
      <div className="relative">
        {/* Gradient background bar */}
        <div className="h-4 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-emerald-500/20 rounded-full overflow-hidden">
          {/* Active progress */}
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out relative"
            style={{
              width: `${sentimentScore}%`,
              backgroundColor: getColor(),
              boxShadow: `0 0 20px ${getColor()}60`
            }}
          >
            {/* Animated shimmer */}
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shimmer 2s infinite'
              }}
            />
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3 text-xs text-gray-500">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div 
          className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${getColor()}20`,
            color: getColor()
          }}
        >
          {getSentimentLabel()}
        </div>
        <div className="text-sm text-gray-400">
          Based on <span className="text-white font-medium">{totalReviews}</span> reviews
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default SentimentBar;