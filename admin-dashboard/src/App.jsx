import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Lightbulb, MessageSquare, Star, MapPin, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import IndiaMap from './components/IndiaMap';
import InsightsBoard from './components/InsightsBoard';
import ReviewsTable from './components/ReviewsTable';
import SentimentBar from './components/SentimentBar';
import StatCard from './components/StatCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ avgRating: 0, total: 0, cities: 0, negPercent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews`);
        const data = await res.json();
        setReviews(data.reviews);
        const total = data.reviews.length;
        const avg = total > 0 ? data.reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
        const cities = new Set(data.reviews.map(r => r.city).filter(Boolean)).size;
        const neg = data.reviews.filter(r => r.rating <= 2).length;
        setStats({ total, avgRating: avg, cities, negPercent: (neg/total * 100) || 0 });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  useEffect(() => {
    const color = stats.avgRating > 3.8 ? 'rgba(16, 185, 129, 0.25)' : 
                  stats.avgRating > 2.8 ? 'rgba(245, 158, 11, 0.25)' : 'rgba(239, 68, 68, 0.25)';
    document.body.style.boxShadow = `inset 0 0 150px ${color}`;
  }, [stats.avgRating]);

  // Chart Data Preparation
  const pieData = [
    { name: '1★', value: reviews.filter(r => r.rating === 1).length, color: '#ef4444' },
    { name: '2★', value: reviews.filter(r => r.rating === 2).length, color: '#f97316' },
    { name: '3★', value: reviews.filter(r => r.rating === 3).length, color: '#f59e0b' },
    { name: '4★', value: reviews.filter(r => r.rating === 4).length, color: '#8b5cf6' },
    { name: '5★', value: reviews.filter(r => r.rating === 5).length, color: '#10b981' },
  ].filter(d => d.value > 0);

  const timelineData = reviews.reduce((acc, r) => {
    const date = new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = acc.find(item => item.date === date);
    if (existing) existing.count++; else acc.push({ date, count: 1 });
    return acc;
  }, []).reverse();

  return (
    <div className="min-h-screen transition-all duration-1000 pb-20 overflow-x-hidden">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] glass-card px-2 py-2 rounded-full flex gap-1 border-white/10 shadow-2xl">
        {['dashboard', 'insights', 'chat'].map(id => (
          <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all text-sm font-bold ${activeTab === id ? 'bg-white/10 text-white' : 'text-slate-500'}`}>
            {id === 'dashboard' ? <LayoutDashboard size={18}/> : id === 'insights' ? <Lightbulb size={18}/> : <MessageSquare size={18}/>}
            <span className="capitalize">{id}</span>
          </button>
        ))}
      </nav>

      <div className="max-w-[1600px] mx-auto pt-32 px-6 lg:px-10 space-y-8">
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <StatCard icon={<MessageSquare size={20}/>} label="Total Reviews" value={stats.total} color="purple" />
               <StatCard icon={<Star size={20}/>} label="Avg Sentiment" value={stats.avgRating.toFixed(2)} color="emerald" />
               <StatCard icon={<MapPin size={20}/>} label="Cities Reached" value={stats.cities} color="blue" />
               <StatCard icon={<AlertCircle size={20}/>} label="Negative Ratio" value={`${stats.negPercent.toFixed(1)}%`} color="red" />
            </div>

            <SentimentBar avgRating={stats.avgRating} totalReviews={stats.total} />

            {/* FULL WIDTH TIMELINE - Dots removed, Axis simplified */}
            <div className="glass-card rounded-[2.5rem] p-8 h-[350px] flex flex-col border-white/5 shadow-inner">
                 <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-8">Review Inception Timeline</h3>
                 <div className="flex-1 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={timelineData}>
                       <defs><linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs>
                       <XAxis 
                         dataKey="date" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{fill: '#475569', fontSize: 10}} 
                         interval={Math.floor(timelineData.length / 6)} // Show fewer labels
                       />
                       <YAxis hide domain={[0, 'auto']} />
                       <Tooltip 
                         contentStyle={{backgroundColor: '#0a0a0c', border: '1px solid #333', color: '#fff', borderRadius: '12px'}} 
                         itemStyle={{color: '#8b5cf6'}}
                       />
                       <Area type="monotone" dataKey="count" stroke="#8b5cf6" dot={false} fillOpacity={1} fill="url(#glow)" strokeWidth={3} />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* PIE CHART – Clean & Minimal */}
              <div className="glass-card rounded-[2rem] p-8 h-[480px] flex flex-col border-white/5">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-[0.25em] mb-6 text-center">
                  Rating Distribution
                </h3>

                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={85}
                        outerRadius={125}
                        paddingAngle={6}
                        stroke="none"
                        label={({ name, percent }) =>
                          percent > 0
                            ? `${name} ${(percent * 100).toFixed(0)}%`
                            : ""
                        }
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.color}
                            className="transition-opacity duration-200 hover:opacity-80"
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0b0b0f",
                          border: "1px solid #1f2933",
                          borderRadius: "10px",
                          fontSize: "13px"
                        }}
                        itemStyle={{ color: "#e5e7eb" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

               <IndiaMap reviews={reviews} />
            </div>

            <ReviewsTable reviews={reviews} loading={loading} />
          </>
        )}
        {activeTab === 'insights' && <InsightsBoard />}
        {activeTab === 'chat' && (
          <div className="glass-card rounded-[3rem] p-20 text-center flex flex-col items-center gap-6 border-white/5">
            
            <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center">
              <MessageSquare size={28} className="text-purple-400" />
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              RAG Chat Interface
            </h2>

            <p className="max-w-xl text-slate-400 text-sm leading-relaxed">
              Soon you’ll be able to ask natural language questions and receive answers
              grounded in real customer feedback and insights from your database.
            </p>

                <p className="mt-8 text-[15px] font-bold tracking-[0.45em] uppercase text-slate-500">
                  Coming Soon
                </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;