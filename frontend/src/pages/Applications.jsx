import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Award, 
  Building, 
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search
} from "lucide-react";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const stages = [
    { key: "discover", label: "Discover", desc: "Profile matched" },
    { key: "understand", label: "Understand", desc: "AI explanation verified" },
    { key: "apply", label: "Apply", desc: "Form & details submitted" },
    { key: "verify", label: "Verify", desc: "OCR & revenue check" },
    { key: "track", label: "Track", desc: "Disbursal & award status" },
  ];

  const getStageIndex = (stageKey) => {
    const idx = stages.findIndex(s => s.key === stageKey);
    return idx >= 0 ? idx : 2;
  };

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        const data = await api.getApplications();
        setApplications(data || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Concept Banner */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-50 text-blue-700">
                  <FileText className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Application Tracking
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Monitor your scholarship lifecycle from submission through document verification and disbursement.
              </p>
            </div>

            <Link
              to="/scholarships"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm self-start sm:self-auto transition-colors"
            >
              <span>Apply for More Scholarships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* VISUAL 5-STAGE LIFECYCLE PROGRESS TRACKER (Section 13 & 27) */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>ScholarLink 5-Stage Scholarship Journey</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {stages.map((st, i) => (
                <div 
                  key={st.key}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center space-y-1 relative"
                >
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Stage {i + 1}
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {st.label}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Submitted Applications ({applications.length})
            </h2>
            <span className="text-xs text-slate-500">
              Direct Benefit Transfer (DBT) verification enabled
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span>Loading registered applications...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs space-y-3">
              <Award className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-800">No applications submitted yet.</p>
              <p className="text-slate-400">Discover scholarships matched to your community and academic profile to begin.</p>
              <Link
                to="/scholarships"
                className="inline-block mt-2 px-4 py-2 bg-blue-700 text-white rounded text-xs font-bold"
              >
                Explore Recommended Scholarships
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map((app) => {
                const stageIdx = getStageIndex(app.current_stage);

                return (
                  <div key={app.id} className="p-6 hover:bg-slate-50/60 transition-colors space-y-4">
                    
                    {/* Top Row: Title, Number, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {app.application_number}
                          </span>
                          <span className="text-xs text-slate-400">
                            Submitted on {app.submitted_at}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug">
                          {app.scholarship_title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.provider}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="self-start sm:self-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                          app.status === "Verified" || app.status === "Selected"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : app.status === "Under Verification"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{app.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Stage Step Progress Indicator */}
                    <div className="py-2">
                      <div className="flex items-center justify-between w-full max-w-2xl text-[11px] font-semibold text-slate-600 mb-1.5">
                        {stages.map((st, idx) => (
                          <div 
                            key={st.key}
                            className={`flex items-center gap-1 ${
                              idx <= stageIdx ? "text-blue-700 font-bold" : "text-slate-400"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                              idx <= stageIdx ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="hidden sm:inline">{st.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="w-full max-w-2xl bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${((stageIdx + 1) / stages.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Verification Notes & Actions */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900">Verification Update: </strong>
                          <span className="text-slate-600">{app.verification_notes}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 font-semibold text-slate-700 transition-colors"
                        >
                          View Audit Trail
                        </button>
                        <Link
                          to="/documents"
                          className="text-blue-700 hover:underline font-semibold"
                        >
                          Manage Documents →
                        </Link>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* AUDIT TRAIL MODAL */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Application Audit Trail
                  </h3>
                  <p className="font-mono text-xs text-blue-700">{selectedApp.application_number}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Scholarship</span>
                  <span className="font-bold text-slate-900">{selectedApp.scholarship_title}</span>
                  <p className="text-slate-500 text-[11px]">{selectedApp.provider}</p>
                </div>

                <div className="space-y-2 border-l-2 border-blue-500 pl-3">
                  <div className="text-[11px]">
                    <span className="font-bold text-slate-800">Application Recorded: </span>
                    <span className="text-slate-500">{selectedApp.submitted_at}</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="font-bold text-slate-800">Current Phase: </span>
                    <span className="text-blue-700 font-semibold capitalize">{selectedApp.current_stage}</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="font-bold text-slate-800">Status: </span>
                    <span className="text-slate-700 font-semibold">{selectedApp.status}</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                  <strong>Authority Telemetry: </strong> {selectedApp.verification_notes}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-blue-700 text-white rounded text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
