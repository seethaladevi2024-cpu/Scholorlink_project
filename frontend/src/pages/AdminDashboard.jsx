import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Plus, 
  Edit, 
  Sparkles, 
  Database, 
  Layers,
  ArrowRight,
  Eye,
  XCircle,
  HelpCircle
} from "lucide-react";

export default function AdminDashboard() {
  const { role, switchRole } = useAuth();
  
  const [activeTab, setActiveTab] = useState("queue"); // "queue" or "knowledge_base"
  const [overview, setOverview] = useState(null);
  const [queue, setQueue] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotes, setActionNotes] = useState("");
  const [selectedQueueItem, setSelectedQueueItem] = useState(null);
  const [actionSuccess, setActionSuccess] = useState("");

  // New Rule Form Modal
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [newRuleData, setNewRuleData] = useState({
    title: "",
    provider: "Ministry of Education",
    category: "Higher Education",
    amount_display: "₹50,000 / year",
    amount_value: 50000,
    deadline: "31 Dec 2026",
    description: "",
    min_marks: 60.0,
    max_income: 300000.0,
    allowed_castes: ["ALL"],
    allowed_courses: ["ALL"],
    required_documents: ["Income Certificate", "Academic Marksheet"]
  });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [ovData, qData, schData] = await Promise.all([
        api.getAdminOverview().catch(() => null),
        api.getVerificationQueue().catch(() => []),
        api.getScholarships().catch(() => [])
      ]);

      setOverview(ovData);
      setQueue(qData || []);
      setScholarships(schData || []);
    } catch (err) {
      console.error("Error loading admin records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [role]);

  const handleQueueAction = async (docId, actionType) => {
    try {
      await api.takeVerificationAction(docId, actionType, actionNotes || `Status updated to ${actionType} by officer`);
      setActionSuccess(`Document ${docId} action "${actionType}" committed successfully.`);
      setSelectedQueueItem(null);
      setActionNotes("");
      await loadAdminData();
    } catch (err) {
      alert(err.message || "Failed to commit verification action.");
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      await api.createScholarshipRule(newRuleData);
      alert("New scholarship scheme rule published with version control!");
      setIsRuleModalOpen(false);
      await loadAdminData();
    } catch (err) {
      alert(err.message || "Failed to create rule.");
    }
  };

  // If user is currently in STUDENT role, show notice and quick switcher
  if (role === "STUDENT") {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Administrative Verification Portal
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your session is currently set to <strong>Candidate (Student)</strong> role. The verification queue and Centralized Knowledge Base require Verifier or Administrator credentials.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => switchRole("VERIFIER")}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-colors"
            >
              Switch to Verification Officer Role
            </button>
            <button
              onClick={() => switchRole("ADMIN")}
              className="w-full py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors"
            >
              Switch to System Administrator Role
            </button>
          </div>
        </div>
      </div>
    );
  }

  const kpis = overview?.kpis || {
    total_applications: 4,
    pending_verification: 2,
    docs_requiring_review: 1,
    potential_mismatches: 1,
    uncertain_ai_cases: 1,
    active_scholarships: 6,
    registered_students: 1
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                ScholarLink Verification & Authority Portal
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active Role: <strong className="text-blue-700 uppercase">{role}</strong>. Manage flagged verification queues and maintain version-controlled scholarship rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("queue")}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${
                activeTab === "queue" ? "bg-blue-700 text-white border-blue-700 shadow-sm" : "bg-white text-slate-700 border-slate-300"
              }`}
            >
              Verification Queue ({kpis.docs_requiring_review})
            </button>
            <button
              onClick={() => setActiveTab("knowledge_base")}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${
                activeTab === "knowledge_base" ? "bg-blue-700 text-white border-blue-700 shadow-sm" : "bg-white text-slate-700 border-slate-300"
              }`}
            >
              Centralized Rules KB ({scholarships.length})
            </button>
          </div>
        </div>

        {/* 5 KPI SUMMARY CARDS */}
        <section className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Applications</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{kpis.total_applications}</div>
            <span className="text-[10px] text-slate-500">Candidate records</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Pending Verification</span>
            <div className="text-2xl font-black text-blue-700 mt-1">{kpis.pending_verification}</div>
            <span className="text-[10px] text-slate-500">Under review</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Docs Requiring Review</span>
            <div className="text-2xl font-black text-amber-700 mt-1">{kpis.docs_requiring_review}</div>
            <span className="text-[10px] text-slate-500">Manual review flags</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Uncertain AI Cases</span>
            <div className="text-2xl font-black text-purple-700 mt-1">{kpis.uncertain_ai_cases}</div>
            <span className="text-[10px] text-slate-500">Low OCR confidence</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Active Schemes</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">{kpis.active_scholarships}</div>
            <span className="text-[10px] text-slate-500">Version controlled</span>
          </div>
        </section>

        {actionSuccess && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess("")} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
        )}

        {/* TAB 1: VERIFICATION QUEUE */}
        {activeTab === "queue" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Verification Queue (Human-in-the-Loop)
                </h2>
                <p className="text-xs text-slate-500">
                  Cases with low OCR confidence or pending authority validation are queued for officer decision.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <span>Loading verification items...</span>
              </div>
            ) : queue.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p>All verification queue items have been audited and resolved.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Student / CAN</th>
                      <th className="px-4 py-3">Document Category</th>
                      <th className="px-4 py-3">Flagged Issue</th>
                      <th className="px-4 py-3">OCR Confidence</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Officer Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {queue.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">{item.student_name}</div>
                          <div className="font-mono text-[11px] text-blue-700">{item.can_number}</div>
                        </td>

                        <td className="px-4 py-4 font-semibold text-slate-800">
                          {item.document_type}
                        </td>

                        <td className="px-4 py-4 text-slate-600 max-w-xs leading-relaxed">
                          {item.issue}
                        </td>

                        <td className="px-4 py-4 font-semibold">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                            item.confidence >= 85 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}>
                            {item.confidence}%
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-medium text-slate-700 text-[11px]">
                            {item.verification_status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedQueueItem(item)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleQueueAction(item.id, "APPROVE")}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleQueueAction(item.id, "REQUEST_CORRECTION")}
                            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[11px]"
                          >
                            Request Correction
                          </button>
                          <button
                            onClick={() => handleQueueAction(item.id, "REJECT")}
                            className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px]"
                          >
                            Reject
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CENTRALIZED KNOWLEDGE BASE */}
        {activeTab === "knowledge_base" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Centralized Scholarship Knowledge Base (Rule Administration)
                </h2>
                <p className="text-xs text-slate-500">
                  Version-controlled repository of official scholarship rules. Changes automatically propagate to the AI Opportunity Engine.
                </p>
              </div>

              {role === "ADMIN" && (
                <button
                  onClick={() => setIsRuleModalOpen(true)}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Scheme Rule</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scholarships.map((sch) => (
                <div key={sch.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {sch.category}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Version: {sch.version}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">
                    {sch.title}
                  </h3>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Provider: <strong className="text-slate-800">{sch.provider}</strong></div>
                    <div>Max Income Ceiling: <strong>₹{sch.rules?.max_income?.toLocaleString() || "2,50,000"}</strong></div>
                    <div>Min Qualifying Score: <strong>{sch.rules?.min_marks || 50}%</strong></div>
                    <div>Communities: <strong>{sch.rules?.allowed_castes?.join(", ") || "All"}</strong></div>
                    <div>Last Updated: <span className="text-slate-400">{sch.last_updated}</span></div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-emerald-700 font-semibold">{sch.amount_display}</span>
                    <span className="text-slate-400 text-[11px]">Rule Status: Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEW DRAWER / MODAL */}
        {selectedQueueItem && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Officer Document Verification Review</h3>
                  <p className="text-xs text-blue-700 font-mono">{selectedQueueItem.student_name} ({selectedQueueItem.can_number})</p>
                </div>
                <button onClick={() => setSelectedQueueItem(null)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <div><strong>Document: </strong> {selectedQueueItem.document_type}</div>
                  <div><strong>File: </strong> {selectedQueueItem.original_filename}</div>
                  <div><strong>OCR Confidence: </strong> <span className="font-bold text-amber-700">{selectedQueueItem.confidence}%</span></div>
                  <div className="text-slate-600 mt-1"><strong>Flagged Reason: </strong> {selectedQueueItem.issue}</div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Officer Audit Remarks / Directions</label>
                  <textarea
                    rows={3}
                    placeholder="Enter audit rationale, seal validation check, or document correction directions..."
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  ></textarea>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs font-semibold">
                <button
                  onClick={() => setSelectedQueueItem(null)}
                  className="px-3 py-2 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleQueueAction(selectedQueueItem.id, "REQUEST_CORRECTION")}
                  className="px-3 py-2 rounded bg-amber-600 text-white hover:bg-amber-500"
                >
                  Request Correction
                </button>
                <button
                  onClick={() => handleQueueAction(selectedQueueItem.id, "APPROVE")}
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-500 font-bold"
                >
                  Approve Verification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PUBLISH NEW RULE MODAL */}
        {isRuleModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Publish New Scholarship Rule</h3>
                <button onClick={() => setIsRuleModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scholarship Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. State Merit Scholarship for Higher Education"
                    value={newRuleData.title}
                    onChange={(e) => setNewRuleData({ ...newRuleData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Provider Authority</label>
                    <input
                      type="text"
                      required
                      value={newRuleData.provider}
                      onChange={(e) => setNewRuleData({ ...newRuleData, provider: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={newRuleData.category}
                      onChange={(e) => setNewRuleData({ ...newRuleData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-300 bg-white"
                    >
                      <option value="Higher Education">Higher Education</option>
                      <option value="Post-Matric">Post-Matric</option>
                      <option value="Merit-cum-Means">Merit-cum-Means</option>
                      <option value="Technical Education">Technical Education</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Disbursal Amount Display</label>
                    <input
                      type="text"
                      required
                      value={newRuleData.amount_display}
                      onChange={(e) => setNewRuleData({ ...newRuleData, amount_display: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Annual Family Income (₹)</label>
                    <input
                      type="number"
                      required
                      value={newRuleData.max_income}
                      onChange={(e) => setNewRuleData({ ...newRuleData, max_income: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Official scheme summary..."
                    value={newRuleData.description}
                    onChange={(e) => setNewRuleData({ ...newRuleData, description: e.target.value })}
                    className="w-full p-2.5 rounded border border-slate-300"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRuleModalOpen(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-700 text-white rounded font-bold hover:bg-blue-600"
                  >
                    Publish Version v1.0
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
