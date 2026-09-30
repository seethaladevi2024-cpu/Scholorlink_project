import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { 
  Award, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Upload,
  Calendar,
  Building,
  Filter,
  Info
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWhyMatch, setSelectedWhyMatch] = useState(null);
  const [applyingScholarship, setApplyingScholarship] = useState(null);
  const [applySuccess, setApplySuccess] = useState(null);

  const studentName = user?.profile?.name || user?.full_name || "Rahul Verma";
  const completionPct = user?.profile?.completion_percentage || 85;

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [scholarshipsData, applicationsData, documentsData] = await Promise.all([
          api.getScholarships(),
          api.getApplications().catch(() => []),
          api.getDocuments().catch(() => [])
        ]);

        setScholarships(scholarshipsData || []);
        setApplications(applicationsData || []);
        setDocuments(documentsData || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const handleApply = async (scholarship) => {
    setApplyingScholarship(scholarship);
    try {
      const res = await api.createApplication(scholarship.id);
      setApplySuccess(res);
      // Refresh applications list
      const updatedApps = await api.getApplications().catch(() => []);
      setApplications(updatedApps);
    } catch (err) {
      alert(err.message || "Failed to submit application.");
    } finally {
      setApplyingScholarship(null);
    }
  };

  // Metrics for Dashboard Cards
  const matchedCount = scholarships.filter(s => s.match_percentage >= 70).length;
  const activeAppsCount = applications.length;
  const pendingDocsCount = documents.filter(d => d.verification_status === "Needs Review" || d.verification_status === "Processing").length;
  const verifiedDocsCount = documents.filter(d => d.verification_status === "Verified").length;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HERO / WELCOME SECTION */}
        <section className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-navy-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Greeting & Subtitle */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-xs font-semibold text-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Scholarship Opportunity Intelligence Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Welcome, {studentName}
              </h1>
              <p className="text-slate-300 text-sm max-w-xl">
                Discover scholarship opportunities matched to your profile with automated criteria explanation and verified document sync.
              </p>
            </div>

            {/* Profile Completion Card */}
            <div className="bg-navy-900/90 border border-navy-700/80 rounded-xl p-4 sm:p-5 w-full lg:w-80 shadow-inner">
              <div className="flex items-center justify-between text-xs mb-2 font-medium">
                <span className="text-slate-300">Profile Completion</span>
                <span className="text-blue-400 font-bold">{completionPct}%</span>
              </div>
              
              {/* Visual Progress Bar */}
              <div className="w-full bg-navy-950 rounded-full h-2.5 overflow-hidden border border-navy-700 mb-3">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${completionPct}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {completionPct < 100 ? "Add academic records" : "All fields complete"}
                </span>
                <Link
                  to="/profile"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
                >
                  Complete Profile →
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* 4 KEY DASHBOARD SUMMARY CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* 1. Matched Scholarships */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Matched Scholarships
              </span>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 mb-1">
                {matchedCount}
              </div>
              <p className="text-xs text-slate-500">
                Opportunities relevant to your profile
              </p>
            </div>
            <Link
              to="/scholarships"
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-700 hover:text-blue-600 flex items-center justify-between group"
            >
              <span>View Scholarships</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 2. Active Applications */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Applications
              </span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 mb-1">
                {activeAppsCount}
              </div>
              <p className="text-xs text-slate-500">
                Submissions tracked in real time
              </p>
            </div>
            <Link
              to="/applications"
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-700 hover:text-emerald-600 flex items-center justify-between group"
            >
              <span>Track Status</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 3. Pending Verification */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pending Verification
              </span>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 mb-1">
                {pendingDocsCount}
              </div>
              <p className="text-xs text-slate-500">
                Documents undergoing manual or OCR check
              </p>
            </div>
            <Link
              to="/documents"
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-amber-700 hover:text-amber-600 flex items-center justify-between group"
            >
              <span>Check Documents</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4. Documents Verified */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Verified Vault
              </span>
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 mb-1">
                {verifiedDocsCount}
              </div>
              <p className="text-xs text-slate-500">
                Certificates authenticated via OCR
              </p>
            </div>
            <Link
              to="/documents"
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-purple-700 hover:text-purple-600 flex items-center justify-between group"
            >
              <span>Upload Document</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </section>

        {/* APPLICATION SUCCESS NOTIFICATION MODAL */}
        {applySuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start justify-between gap-4 text-xs text-emerald-900">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block">Application Successfully Submitted!</span>
                <p>Application Reference: <strong className="font-mono text-emerald-800">{applySuccess.application_number}</strong> for {applySuccess.scholarship_title}.</p>
                <p className="text-[11px] text-slate-600 mt-1">{applySuccess.verification_notes}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/applications")}
                className="px-3 py-1.5 rounded bg-emerald-700 text-white font-semibold hover:bg-emerald-600 text-xs"
              >
                Track in Applications
              </button>
              <button
                onClick={() => setApplySuccess(null)}
                className="text-slate-500 hover:text-slate-800 text-xs px-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* RECOMMENDED SCHOLARSHIPS SECTION */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>Recommended Scholarships</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {scholarships.length} Available
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Ranked using ScholarLink Opportunity Intelligence matching rules
              </p>
            </div>

            <Link
              to="/scholarships"
              className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore All Scholarships</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.slice(0, 6).map((sch) => {
              const match = sch.match_percentage || 80;
              const isApplied = applications.some(a => a.scholarship_id === sch.id);

              return (
                <div 
                  key={sch.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {sch.category}
                      </span>

                      {/* Match Badge */}
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        match >= 85 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : match >= 60 
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}>
                        {match}% Profile Match
                      </span>
                    </div>

                    {/* Title & Provider */}
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-blue-700 transition-colors">
                        <Link to={`/scholarships/${sch.id}`}>{sch.title}</Link>
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{sch.provider}</span>
                      </div>
                    </div>

                    {/* Benefit Amount & Deadline */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Benefit</span>
                        <span className="font-bold text-slate-800 text-xs line-clamp-1">{sch.amount_display}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Deadline</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{sch.deadline}</span>
                        </span>
                      </div>
                    </div>

                    {/* AI Eligibility Reason Button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedWhyMatch(sch)}
                        className="w-full py-1.5 px-3 rounded text-xs font-semibold text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>Why you match</span>
                        </span>
                        <span className="text-[10px] text-blue-600">Explain Criteria →</span>
                      </button>
                    </div>

                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Link
                      to={`/scholarships/${sch.id}`}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded hover:bg-white transition-colors"
                    >
                      View Details
                    </Link>

                    {isApplied ? (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(sch)}
                        disabled={applyingScholarship?.id === sch.id}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-sm transition-colors disabled:opacity-50"
                      >
                        {applyingScholarship?.id === sch.id ? "Submitting..." : "Apply Now"}
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        {/* AI ELIGIBILITY EXPLANATION MODAL / DRAWER */}
        {selectedWhyMatch && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>ScholarLink AI Explanation</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {selectedWhyMatch.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedWhyMatch(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Match Score Indicator */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Overall Eligibility Match</span>
                  <span className="font-bold text-slate-900 text-sm">Status: {selectedWhyMatch.eligibility_status || "Potentially Eligible"}</span>
                </div>
                <div className="text-xl font-black text-blue-700">
                  {selectedWhyMatch.match_percentage}%
                </div>
              </div>

              {/* "Why You Match" Positive Factors */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Why you match</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedWhyMatch.why_you_match && selectedWhyMatch.why_you_match.length > 0 ? (
                    selectedWhyMatch.why_you_match.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded border border-emerald-100">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">Criteria matched against profile community, income, and academic score.</li>
                  )}
                </ul>
              </div>

              {/* "Missing / Uncertain Information" */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Missing / Uncertain Information</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedWhyMatch.missing_info && selectedWhyMatch.missing_info.length > 0 ? (
                    selectedWhyMatch.missing_info.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-amber-50/50 p-2 rounded border border-amber-100">
                        <span className="text-amber-600 font-bold shrink-0">⚠</span>
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">No missing criteria flagged from current verified records.</li>
                  )}
                </ul>
              </div>

              {/* Regulatory Disclaimer */}
              <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Preliminary Match Notice:</strong> {selectedWhyMatch.disclaimer || "Preliminary match generated based on profile attributes. Official award remains subject to authority document verification."}
                </p>
              </div>

              {/* Close & Action */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedWhyMatch(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 rounded"
                >
                  Close
                </button>
                <Link
                  to={`/scholarships/${selectedWhyMatch.id}`}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 rounded"
                >
                  View Full Criteria
                </Link>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
