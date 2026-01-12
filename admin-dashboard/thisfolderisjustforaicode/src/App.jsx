import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Star, AlertCircle, Search, Filter, Calendar, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import SentimentBar from './components/SentimentBar';
import StatCard from './components/StatCard';
import ReviewsTable from './components/ReviewsTable';
import MapVisualization from './components/MapVisualization';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    negativePercent: 0,
    recent24h: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadReviews();
    const interval = setInterval(() => {
      loadReviews();
      setLastUpdate(new Date());
    }, 30000); // Auto-refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reviews`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setReviews(data.reviews);
      calculateStats(data.reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviewsList) => {
    const total = reviewsList.length;
    const avgRating = total > 0 
      ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / total 
      : 0;
    const negativeCount = reviewsList.filter(r => r.rating <= 2).length;
    const negativePercent = total > 0 ? (negativeCount / total) * 100 : 0;
    const recent24h = reviewsList.filter(r => {
      const reviewDate = new Date(r.created_at);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return reviewDate > dayAgo;
    }).length;

    setStats({ total, avgRating, negativePercent, recent24h });
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.review?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    const matchesCity = filterCity === 'all' || review.city === filterCity;
    
    return matchesSearch && matchesRating && matchesCity;
  });

  // Get rating distribution for chart
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating}★`,
    count: reviews.filter(r => r.rating === rating).length
  }));

  // Get trend data (last 7 days)
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayReviews = reviews.filter(r => {
      const reviewDate = new Date(r.created_at);
      return reviewDate.toDateString() === date.toDateString();
    });
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: dayReviews.length,
      avgRating: dayReviews.length > 0 
        ? dayReviews.reduce((sum, r) => sum + r.rating, 0) / dayReviews.length 
        : 0
    };
  });

  // Get unique cities
  const cities = ['all', ...new Set(reviews.map(r => r.city).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background gradients */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative z-10 p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-emerald-200 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">
                Live • Last updated {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <p className="text-gray-400 text-lg">Real-time customer feedback insights</p>
        </div>

        {/* Sentiment Health Bar */}
        <div className="mb-6">
          <SentimentBar avgRating={stats.avgRating} totalReviews={stats.total} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users size={24} />}
            label="Total Reviews"
            value={stats.total}
            color="purple"
          />
          <StatCard
            icon={<Star size={24} />}
            label="Average Rating"
            value={stats.avgRating.toFixed(1)}
            color="emerald"
          />
          <StatCard
            icon={<AlertCircle size={24} />}
            label="Negative Reviews"
            value={`${stats.negativePercent.toFixed(0)}%`}
            color="red"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            label="Last 24 Hours"
            value={stats.recent24h}
            color="blue"
          />
        </div>

        {/* Charts & Map Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Rating Distribution */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-3xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ratingDistribution}>
                <XAxis dataKey="rating" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1f', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#8A3FFC" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Chart */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-3xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">7-Day Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1f', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#22FFB0" 
                  strokeWidth={3}
                  dot={{ fill: '#22FFB0', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Map Visualization */}
          <MapVisualization reviews={reviews} />
        </div>

        {/* Filters */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-2xl p-4 border border-white/10 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reviews, names, cities..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
            >
              <option value="all">All Ratings</option>
              {[5, 4, 3, 2, 1].map(rating => (
                <option key={rating} value={rating}>{rating} Stars</option>
              ))}
            </select>

            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city === 'all' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reviews Table */}
        <ReviewsTable reviews={filteredReviews} loading={loading} />
      </div>
    </div>
  );
}

export default App;