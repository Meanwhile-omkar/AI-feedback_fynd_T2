import React, { useState, useEffect } from 'react';

function StatCard({ icon, label, value, color = 'purple' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) {
      setDisplayValue(value);
      return;
    }

    const duration = 1000;
    const steps = 30;
    const increment = numValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorClasses = {
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400',
    emerald: 'from-emerald-500/20 to-emerald-600/20 text-emerald-400',
    red: 'from-red-500/20 to-red-600/20 text-red-400',
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400'
  };

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div 
          className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-4xl font-bold text-white">
          {displayValue}
        </p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;