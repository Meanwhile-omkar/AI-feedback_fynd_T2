import React from 'react';
import { MapPin } from 'lucide-react';

function MapVisualization({ reviews }) {
  // Aggregate reviews by city
  const cityData = reviews.reduce((acc, review) => {
    if (review.city) {
      acc[review.city] = (acc[review.city] || 0) + 1;
    }
    return acc;
  }, {});

  const topCities = Object.entries(cityData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const maxCount = Math.max(...topCities.map(([, count]) => count), 1);

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-3xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Top Locations</h3>
      
      <div className="space-y-3">
        {topCities.length > 0 ? (
          topCities.map(([city, count]) => {
            const percentage = (count / maxCount) * 100;
            
            return (
              <div key={city} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-purple-400" />
                    <span className="text-gray-300">{city}</span>
                  </div>
                  <span className="text-gray-400 font-medium">{count}</span>
                </div>
                
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            No location data available
          </p>
        )}
      </div>
    </div>
  );
}

export default MapVisualization;
