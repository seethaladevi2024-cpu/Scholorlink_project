import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { 
  Building, 
  Calendar, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  Bookmark, 
  Info, 
  Share2, 
  HelpCircle,
  ShieldCheck,
  Send
} from "lucide-react";

export default function ScholarshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [applying, setApplying] = useState(false);
  const [appliedInfo, setAppliedInfo] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const data = await api.getScholarshipDetail(id);
        setScholarship(data);
      } catch (err) {
        console.error("Error fetching scholarship details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  const handleApply = async () => {
    if (!scholarship) return;
    setApplying(true);
    try {
      const res = await api.createApplication(scholarship.id);
      setAppliedInfo(res);
    } catch (err) {
      alert(err.message || "Could not submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading verified scholarship rules and criteria...</p>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Scholarship Not Found</h2>
          <p className="text-xs text-slate-500">The requested scholarship scheme does not exist or has been archived.</p>
          <Link to="/scholarships" className="px-4 py-2 bg-blue-700 text-white rounded text-xs font-semibold">
            Return to Discovery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <Link 
          to="/scholarships" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Scholarships</span>
        </Link>

        {/* Top Header Card */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {scholarship.category}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                  bookmarked 
                    ? "bg-amber-50 text-amber-800 border-amber-300" 
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-amber-600 text-amber-600" : ""}`} />
                <span>{bookmarked ? "Saved in Bookmarks" : "Bookmark"}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Official scholarship link copied to clipboard.");
                }}
                className="p-1.5 rounded text-slate-500 hover:text-slate-800 border border-slate-300 hover:bg-slate-50"
                title="Share Scholarship"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {scholarship.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">{scholarship.provider}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Deadline: <strong className="text-slate-800">{scholarship.deadline}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-slate-400" />
              <span>Disbursal: <strong className="text-emerald-700 font-bold">{scholarship.amount_display}</strong></span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Rules Ver: {scholarship.version} (Updated {scholarship.last_updated})
            </div>
          </div>

          {/* Applied Confirmation Banner */}
          {appliedInfo ? (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-2 text-sm text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application Submitted Successfully!</span>
              </div>
              <p>Reference ID: <strong className="font-mono">{appliedInfo.application_number}</strong></p>
              <p className="text-[11px] text-slate-600">{appliedInfo.verification_notes}</p>
              <div className="pt-2">
                <button
                  onClick={() => navigate("/applications")}
                  className="px-3 py-1 rounded bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-600"
                >
                  View in My Applications →
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Preliminary Match Score: <strong className="text-blue-700 text-sm">{scholarship.match_percentage}%</strong>
              </div>
              <button
                onClick={handleApply}
                disabled={applying}
                className="px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {applying ? "Submitting Application..." : "Apply Now"}
              </button>
            </div>
          )}

        </div>

        {/* AI Eligibility Explanation Box */}
        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>ScholarLink AI Eligibility Explanation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Why You Match */}
            <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Why You Match</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {scholarship.why_you_match && scholarship.why_you_match.length > 0 ? (
                  scholarship.why_you_match.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">Criteria matched against your profile.</li>
                )}
              </ul>
            </div>

            {/* Missing or Uncertain */}
            <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Missing / Uncertain Information</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-950">
                {scholarship.missing_info && scholarship.missing_info.length > 0 ? (
                  scholarship.missing_info.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">⚠</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">All required preliminary data provided.</li>
                )}
              </ul>
            </div>

          </div>

          {/* Legal Notice */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              {scholarship.disclaimer || "Preliminary match generated by ScholarLink Opportunity Intelligence Engine. Official sanction is granted solely by the issuing authority upon verification of physical/certified revenue records."}
            </p>
          </div>
        </section>

        {/* Detailed Criteria Tabs/Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Content (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Overview */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Scholarship Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {scholarship.description}
              </p>
            </div>

            {/* Eligibility Rules */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Eligibility Criteria
              </h3>
              
              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Income Limit</span>
                  <span className="font-bold text-slate-900">
                    Annual family income below ₹{scholarship.rules?.max_income?.toLocaleString() || "2,50,000"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Minimum Academic Score</span>
                  <span className="font-bold text-slate-900">
                    {scholarship.rules?.min_marks || 50.0}% in qualifying examination
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Eligible Communities</span>
                  <span className="font-bold text-slate-900">
                    {scholarship.rules?.allowed_castes?.join(", ") || "All Categories"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold text-slate-500">Gender Preference</span>
                  <span className="font-bold text-slate-900">
                    {scholarship.rules?.gender_preference === "FEMALE" ? "Female Students Only" : "All Genders Eligible"}
                  </span>
                </div>
              </div>
            </div>

            {/* Application Process Steps */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Application & Disbursal Process
              </h3>
              
              <ol className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <div>
                    <strong className="text-slate-900 block">Complete Profile & Pre-Check:</strong>
                    Ensure your community, annual income, and institution enrollment details match your revenue documents.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <div>
                    <strong className="text-slate-900 block">OCR Document Extraction:</strong>
                    Upload Income, Caste, and Academic Marksheet to the ScholarLink Document Vault for automated field extraction.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <div>
                    <strong className="text-slate-900 block">Verification & Direct Benefit Transfer:</strong>
                    Approved applications are routed for Direct Benefit Transfer (DBT) credit directly into the student's validated bank account.
                  </div>
                </li>
              </ol>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-3">
                {scholarship.faqs && scholarship.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="font-bold text-slate-900">{faq.question}</div>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Required Documents & Timeline */}
          <div className="space-y-6">
            
            {/* Required Documents Checklist */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Required Documents</span>
              </h3>

              <ul className="space-y-2 text-xs text-slate-700">
                {scholarship.rules?.required_documents?.map((docName, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>{docName}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/documents"
                className="w-full py-2 px-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-center block transition-colors"
              >
                Go to Document Vault →
              </Link>
            </div>

            {/* Important Dates */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Important Dates</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="border-l-2 border-blue-500 pl-3">
                  <div className="font-semibold text-slate-900">Application Window Open</div>
                  <div className="text-[11px] text-slate-500">Active for Current Academic Session</div>
                </div>
                <div className="border-l-2 border-rose-500 pl-3">
                  <div className="font-semibold text-slate-900">Last Date of Submission</div>
                  <div className="text-[11px] text-rose-600 font-bold">{scholarship.deadline}</div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3">
                  <div className="font-semibold text-slate-900">Disbursal Target</div>
                  <div className="text-[11px] text-slate-500">Within 45 days of institutional verification</div>
                </div>
              </div>
            </div>

            {/* Verification Guarantee */}
            <div className="p-4 rounded-xl bg-navy-950 text-white space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-blue-400">
                <ShieldCheck className="w-4 h-4" />
                <span>ScholarLink Security</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                All document uploads are processed through automated OCR integrity auditing with human officer oversight for flagged cases.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
