import React, { useState } from 'react';
import { Star, MapPin, ChevronRight, ChevronDown, Rocket, ShieldAlert, Filter, Search } from 'lucide-react';

export default function ReviewsTable({ reviews, loading }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterCity, setFilterCity] = useState("all");

  const cities = ["all", ...new Set(reviews.map(r => r.city).filter(Boolean))];

  const filtered = reviews.filter(r => {
    const matchesSearch =
      `${r.name || ""} ${r.city || ""} ${r.review || ""} ${r.ai_summary || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesRating =
      filterRating === "all" || r.rating === parseInt(filterRating);

    const matchesCity =
      filterCity === "all" || r.city === filterCity;

    return matchesSearch && matchesRating && matchesCity;
  });

  if (loading)
    return <div className="p-20 text-center text-slate-500 italic">Synchronizing...</div>;

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-bold text-white">User Feedback Archive</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search feedback..."
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-5 py-3 text-[12px] text-white outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="glass-card rounded-[2rem] border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/[0.03] border-b border-white/5">
            <tr>
              <th className="px-8 py-5 text-[12px] font-bold text-slate-500 uppercase tracking-widest">
                Customer
              </th>

              {/* Rating Filter */}
              <th className="px-8 py-5 text-[12px] font-bold text-slate-500 uppercase tracking-widest relative">
                <div className="flex items-center gap-2">
                  Rating <Filter size={14} className="text-slate-600" />
                  <select
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    value={filterRating}
                    onChange={e => setFilterRating(e.target.value)}
                  >
                    <option value="all">All</option>
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>
              </th>

              <th className="px-8 py-5 text-[12px] font-bold text-slate-500 uppercase tracking-widest">
                AI Intelligence
              </th>

              {/* Location Filter */}
              <th className="px-8 py-5 text-[12px] font-bold text-slate-500 uppercase tracking-widest relative">
                <div className="flex items-center gap-2">
                  Location <Filter size={14} className="text-slate-600" />
                  <select
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    value={filterCity}
                    onChange={e => setFilterCity(e.target.value)}
                  >
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </th>

              <th className="px-4 py-5"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filtered.map((r) => (
              <React.Fragment key={r.id}>
                <tr onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-white">{r.name || "Anonymous"}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{r.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 w-fit">
                      <Star size={12} className="text-purple-400 fill-purple-400" />
                      <span className="text-sm font-bold text-white">{r.rating}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-400 max-w-xs truncate">{r.ai_summary}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-medium">
                       <MapPin size={12}/> {r.city || "Global"}
                    </div>
                  </td>
                  <td className="px-4 py-6 text-right text-slate-600 group-hover:text-purple-400 transition-colors">
                    {expandedRow === r.id ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                  </td>
                </tr>
                {expandedRow === r.id && (
                  <tr className="bg-purple-500/[0.02] border-l-4 border-purple-500/50 transition-all animate-in fade-in zoom-in duration-300">
                    <td colSpan="5" className="px-10 py-12">
                       <div className="flex flex-col lg:flex-row gap-12">
                          <div className="flex-1 space-y-4">
                             <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-[0.2em]">Customer Voice</h4>
                             <p className="text-m font-medium text-slate-200 leading-relaxed italic">"{r.review || "User provided no text feedback."}"</p>
                          </div>
                          <div className="flex-1 p-5 rounded-[2.5rem] bg-white/[0.02] border border-white/5 shadow-2xl">
                             <div className="flex items-center gap-3 mb-4 text-emerald-400">
                                <Rocket size={18}/>
                                <h4 className="text-[13px] font-bold uppercase tracking-widest">Priority Recommendation</h4>
                             </div>
                             <p className="text-m font-medium text-slate-200 mb-6 leading-tight">{r.ai_action}</p>
                             <hr className="border-white/5 mb-6"/>
                             <div className="flex items-center gap-2 mb-3 text-purple-400">
                                <ShieldAlert size={14}/>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest">AI Contextual Analysis</h4>
                             </div>
                             <p className="text-sm text-slate-400 leading-relaxed">{r.ai_summary}</p>
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
