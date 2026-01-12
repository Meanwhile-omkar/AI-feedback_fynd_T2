import React, { useState } from 'react';
import { Lightbulb, Rocket, Zap, Bug, AlertTriangle } from 'lucide-react';

const STAR_CATEGORIES = [
  { rating: 5, label: "Golden Standards", sub: "What's working best", icon: <Rocket className="text-emerald-400" />, color: "border-emerald-500/30 bg-emerald-500/5" },
  { rating: 4, label: "Optimization Zone", sub: "Refine to excellence", icon: <Zap className="text-blue-400" />, color: "border-blue-500/30 bg-blue-500/5" },
  { rating: 3, label: "Attentive Gaps", sub: "Minor friction points", icon: <Lightbulb className="text-amber-400" />, color: "border-amber-500/30 bg-amber-500/5" },
  { rating: 2, label: "Critical Weakness", sub: "Problems to solve", icon: <AlertTriangle className="text-orange-400" />, color: "border-orange-500/30 bg-orange-500/5" },
  { rating: 1, label: "Immediate Fixes", sub: "Severe pain points", icon: <Bug className="text-red-400" />, color: "border-red-500/30 bg-red-500/5" },
];

export default function InsightsBoard() {
  const [selectedRating, setSelectedRating] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async (rating) => {
    setLoading(true);
    setSelectedRating(rating);
    const res = await fetch(`http://localhost:8000/api/analytics/insights?rating=${rating}`, { method: 'POST' });
    const json = await res.json();
    setData(json.insights);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {STAR_CATEGORIES.map((cat) => (
          <button 
            key={cat.rating} 
            onClick={() => fetchInsights(cat.rating)}
            className={`p-6 rounded-3xl border text-left transition-all ${selectedRating === cat.rating ? 'ring-2 ring-purple-500' : ''} ${cat.color}`}
          >
            {cat.icon}
            <div className="mt-4 font-bold text-white leading-tight">{cat.label}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-tighter mt-1">{cat.sub}</div>
          </button>
        ))}
      </div>

      <div className="glass-card rounded-[3rem] p-10 min-h-[300px] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Lightbulb size={200} />
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-full animate-pulse text-slate-500 uppercase tracking-widest font-bold">Consulting Intelligence...</div>
        ) : selectedRating ? (
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              Action Plan for {selectedRating} Stars
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.map((point, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">{i+1}</div>
                  <p className="text-slate-300 text-sm font-medium">{point}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-600 font-medium">Select a category above to generate star-wise strategy</div>
        )}
      </div>
    </div>
  );
}