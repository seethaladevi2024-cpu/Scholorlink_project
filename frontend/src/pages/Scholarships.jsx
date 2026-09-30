import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { 
  Search, 
  Filter, 
  Award, 
  Building, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink
} from "lucide-react";

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [minMatch, setMinMatch] = useState(0);

  const categories = [
    "ALL",
    "Post-Matric",
    "Higher Education",
    "Merit-cum-Means",
    "Technical Education",
    "Pre-Matric & Secondary",
    "Special Assistance"
  ];

  useEffect(() => {
    async function loadScholarships() {
      try {
        setLoading(true);
        const data = await api.getScholarships({
          category: categoryFilter,
          search: searchTerm,
          min_match: minMatch
        });
        setScholarships(data || []);
      } catch (err) {
        console.error("Failed to load scholarships:", err);
      } finally {
        setLoading(false);
      }
    }
    loadScholarships();
  }, [categoryFilter, searchTerm, minMatch]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Title */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Scholarship Discovery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            Explore national and state scholarship opportunities. The ScholarLink Opportunity Intelligence Engine continuously evaluates your profile attributes against official gazetted scheme rules.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by scholarship title, ministry, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "ALL" ? "All Categories" : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Match Filter */}
            <div className="md:col-span-2">
              <select
                value={minMatch}
                onChange={(e) => setMinMatch(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-semibold"
              >
                <option value={0}>Any Match %</option>
                <option value={50}>≥ 50% Match</option>
                <option value={75}>≥ 75% Match</option>
                <option value={90}>≥ 90% Match</option>
              </select>
            </div>

          </div>
        </div>

        {/* Scholarships List */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <span>Evaluating scholarship rules against candidate profile...</span>
          </div>
        ) : scholarships.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Matching Scholarships Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or updating your profile to expand matching opportunities.
            </p>
            <button
              onClick={() => { setSearchTerm(""); setCategoryFilter("ALL"); setMinMatch(0); }}
              className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((sch) => {
              const match = sch.match_percentage || 80;
              return (
                <div 
                  key={sch.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {sch.category}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        match >= 85 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {match}% Match
                      </span>
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-blue-700 transition-colors">
                        <Link to={`/scholarships/${sch.id}`}>{sch.title}</Link>
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{sch.provider}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {sch.description}
                    </p>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Disbursal Amount</span>
                        <span className="font-bold text-slate-800 text-xs line-clamp-1">{sch.amount_display}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Application Deadline</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{sch.deadline}</span>
                        </span>
                      </div>
                    </div>

                    {/* Positive match tags preview */}
                    {sch.why_you_match && sch.why_you_match.length > 0 && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded border border-emerald-100 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{sch.why_you_match[0]}</span>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">Rules Ver: {sch.version}</span>
                    <Link
                      to={`/scholarships/${sch.id}`}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <span>View & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
