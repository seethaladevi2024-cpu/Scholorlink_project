import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, ExternalLink, HelpCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-navy-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-navy-900 border border-navy-700 p-1 flex items-center justify-center">
                <img 
                  src="/scholarlink_logo.png" 
                  alt="ScholarLink Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">
                  ScholarLink
                </span>
                <p className="text-xs text-blue-400 font-medium">
                  Scholarship Opportunity Intelligence Engine
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-md">
              ScholarLink transforms the scholarship journey through automated eligibility discovery,
              plain-language requirement explanations, OCR-based document verification, and end-to-end application lifecycle tracking.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                Discover
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                Explain
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                Verify
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                Assist
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Home / Registration
                </Link>
              </li>
              <li>
                <Link to="/scholarships" className="hover:text-blue-400 transition-colors">
                  Scholarship Discovery
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-blue-400 transition-colors">
                  Document Vault & OCR
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-blue-400 transition-colors">
                  Track Applications
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-blue-400 transition-colors">
                  Verification Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Regulatory & Security */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Security & Verification
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Encrypted Document Vault</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Role-Based Access Control</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Human-in-the-Loop Audit</span>
              </li>
              <li className="pt-2">
                <Link to="/guidelines" className="text-blue-400 hover:underline flex items-center gap-1">
                  <span>Help & Contact Support</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} ScholarLink Intelligence Engine. All official rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/guidelines" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/guidelines" className="hover:text-slate-400 transition-colors">
              Terms of Verification
            </Link>
            <Link to="/guidelines" className="hover:text-slate-400 transition-colors">
              Data Security Standards
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
