import React, { useState } from 'react';
import { Star, MapPin, Calendar, ChevronRight, ChevronDown, AlertCircle } from 'lucide-react';

function ReviewsTable({ reviews, loading }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const getRatingColor = (rating) => {
    if (rating <= 2) return 'text-red-400';
    if (rating === 3) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getStatusBadge = (status) => {
    const styles = {
      complete: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      pending_ai: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      ai_failed: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${styles[status] || styles.complete}`}>
        {status === 'complete' ? 'Complete' : status === 'pending_ai' ? 'Processing' : 'Failed'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-2xl p-12 border border-white/10 text-center">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-2xl p-12 border border-white/10 text-center">
        <AlertCircle size={48} className="text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No reviews found</p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rating</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Review</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">AI Summary</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Location</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <React.Fragment key={review.id}>
                <tr 
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => setExpandedRow(expandedRow === review.id ? null : review.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Star size={18} className={`fill-current ${getRatingColor(review.rating)}`} />
                      <span className={`font-semibold ${getRatingColor(review.rating)}`}>
                        {review.rating}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {review.review || 'No written feedback'}
                      </p>
                      {review.name && (
                        <p className="text-gray-500 text-xs mt-1">by {review.name}</p>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <p className="text-gray-400 text-sm max-w-xs line-clamp-2">
                      {review.ai_summary || 'Processing...'}
                    </p>
                  </td>
                  
                  <td className="px-6 py-4">
                    {review.city ? (
                      <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                        <MapPin size={14} />
                        {review.city}
                      </div>
                    ) : (
                      <span className="text-gray-600 text-sm">N/A</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(review.status)}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Calendar size={14} />
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {expandedRow === review.id ? (
                      <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                  </td>
                </tr>
                
                {expandedRow === review.id && (
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <td colSpan="7" className="px-6 py-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Full Review</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                              {review.review || 'No written feedback provided'}
                            </p>
                          </div>
                          
                          {review.email && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-300 mb-1">Email</h4>
                              <p className="text-gray-400 text-sm">{review.email}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                            <h4 className="text-sm font-semibold text-purple-300 mb-2">AI Analysis</h4>
                            <p className="text-gray-300 text-sm">{review.ai_summary}</p>
                          </div>
                          
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <h4 className="text-sm font-semibold text-emerald-300 mb-2">Recommended Action</h4>
                            <p className="text-gray-300 text-sm">{review.ai_action}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReviewsTable;