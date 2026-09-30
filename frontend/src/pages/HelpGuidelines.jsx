import React from "react";
import { Link } from "react-router-dom";
import { 
  HelpCircle, 
  FileCheck, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  PhoneCall, 
  Mail, 
  ExternalLink 
} from "lucide-react";

export default function HelpGuidelines() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              ScholarLink Verification Guidelines & Candidate Helpdesk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            Understand how ScholarLink's intelligence engine evaluates eligibility, processes document validation through automated OCR, and tracks application disbursement.
          </p>
        </div>

        {/* 5-Stage Journey Explanation */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            The ScholarLink 5-Stage Lifecycle
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-blue-700 block">Stage 1: Discover</span>
              <p className="text-slate-600 text-[11px]">
                Intelligent matching compares community, income, and academic profile against gazetted scheme rules.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-blue-700 block">Stage 2: Understand</span>
              <p className="text-slate-600 text-[11px]">
                Plain-language explanations break down "Why you match" and flag any missing records before application.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-blue-700 block">Stage 3: Apply</span>
              <p className="text-slate-600 text-[11px]">
                One-click candidate application generated with official tracking reference ID and pre-filled data.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-blue-700 block">Stage 4: Verify</span>
              <p className="text-slate-600 text-[11px]">
                OCR extracts certificate serials, digital signatures, and seals with human review for low-confidence scans.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-blue-700 block">Stage 5: Track</span>
              <p className="text-slate-600 text-[11px]">
                End-to-end milestone tracking until funds are credited via Direct Benefit Transfer (DBT).
              </p>
            </div>
          </div>
        </div>

        {/* Document Preparation Guidelines */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Document Preparation & Quality Checklist</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900">Income Certificate</h3>
              <ul className="space-y-1 list-disc pl-4 text-slate-600 text-[11px]">
                <li>Issued by an authorized Tehsildar, Revenue Officer, or District Magistrate.</li>
                <li>Must bear a verifiable QR code or digital signature seal.</li>
                <li>Validity must cover the current financial and academic year.</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900">Community / Caste Certificate</h3>
              <ul className="space-y-1 list-disc pl-4 text-slate-600 text-[11px]">
                <li>Issued in the name of the student or legal guardian.</li>
                <li>Category (SC, ST, OBC, EWS) must clearly match state or central reservation gazette.</li>
                <li>Digital certificate serial number must be clear and unobstructed.</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900">Academic Qualifying Marksheet</h3>
              <ul className="space-y-1 list-disc pl-4 text-slate-600 text-[11px]">
                <li>Color scan of official board / university grade report.</li>
                <li>Marks percentage, student name, and roll number must be clearly legible.</li>
                <li>OCR confidence drops if grades or signature lines are blurred.</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900">Bank Account & Direct Benefit Transfer</h3>
              <ul className="space-y-1 list-disc pl-4 text-slate-600 text-[11px]">
                <li>Account must be in the student's own name (no joint accounts unless specified).</li>
                <li>Must be active and seeded with candidate's Aadhaar number for DBT disbursal.</li>
                <li>Valid IFSC code and branch details verifiable on passbook front page.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Common Inquiries
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-900">What does "Needs Review" status mean on my document?</div>
              <p className="text-slate-600 leading-relaxed">
                When OCR scanning confidence is below 85% (due to scan resolution, paper folds, or background watermark), the file is routed to our Human Verification Officers to verify details manually without rejecting your application.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-900">Can I apply for more than one scholarship?</div>
              <p className="text-slate-600 leading-relaxed">
                Candidates may apply for multiple eligible schemes. However, under national norms, students may only avail benefit from one centrally funded or state maintenance scheme concurrently unless explicitly permitted as a merit award.
              </p>
            </div>
          </div>
        </div>

        {/* Helpdesk Contact Card */}
        <div className="bg-navy-950 text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-sm text-blue-400">Need Verification Assistance?</h3>
            <p className="text-slate-300">
              The ScholarLink Helpdesk is available Monday through Saturday from 09:00 to 18:00 IST.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-300 shrink-0">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-blue-400" />
              <span>1800-11-2026 (Toll Free)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>support@scholarlink.gov.in</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
