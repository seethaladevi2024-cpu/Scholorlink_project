import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Database,
  ExternalLink
} from "lucide-react";

export default function Profile() {
  const { user, setUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: "",
    gender: "Male",
    dob: "",
    phone: "",
    email: "",
    can_number: "",
    caste: "OBC",
    community: "",
    annual_income: 180000,
    current_course: "B.Tech Computer Science & Engineering",
    institution_name: "National Institute of Technology",
    marks_percentage: 84.5,
    state: "National"
  });

  const [sheetStatus, setSheetStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const [prof, sheet] = await Promise.all([
          api.getMyProfile().catch(() => null),
          api.getSheetStatus().catch(() => null)
        ]);

        if (prof) {
          setProfileData(prof);
        } else if (user?.profile) {
          setProfileData(user.profile);
        }

        if (sheet) {
          setSheetStatus(sheet);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await api.updateProfile(profileData);
      setSuccessMsg("Student profile attributes successfully updated and validated.");
      if (res.profile) {
        setProfileData(res.profile);
        // Update user in context
        setUser(prev => ({
          ...prev,
          full_name: res.profile.name,
          profile: res.profile
        }));
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Title */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <User className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Student Profile Management
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Maintain your verified candidate profile used by the ScholarLink Opportunity Intelligence Engine for scheme matching.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            <span>CAN: </span>
            <span className="font-mono font-bold">{profileData.can_number || "CAN-2025-98241"}</span>
          </div>
        </div>

        {/* Google Sheet Integration Status Banner */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-3">
            <Database className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span>Google Sheets Storage Destination</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  Configured
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Destination Sheet ID: <strong className="font-mono text-slate-700">1xe5SWyKWt9Zmhcrw4zA3F6uBS3e_OsDbT63rHR0kmSg</strong>
              </p>
            </div>
          </div>

          <a
            href="https://docs.google.com/spreadsheets/d/1xe5SWyKWt9Zmhcrw4zA3F6uBS3e_OsDbT63rHR0kmSg/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1 self-start sm:self-auto hover:underline"
          >
            <span>Open Destination Sheet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Profile Edit Form */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          {successMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Section 1: Personal & Contact */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                1. Personal & Contact Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={profileData.gender || "Male"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={profileData.dob || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email ID</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Candidate Application Number (CAN)</label>
                  <input
                    type="text"
                    name="can_number"
                    readOnly
                    value={profileData.can_number || ""}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-mono text-sm cursor-not-allowed"
                    title="CAN number is registered permanently with your account"
                  />
                </div>

              </div>
            </div>

            {/* Section 2: Community & Reservation */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                2. Community & Financial Criteria
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Caste Category</label>
                  <select
                    name="caste"
                    value={profileData.caste || "OBC"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="General">General / Open</option>
                    <option value="EWS">EWS</option>
                    <option value="Minority">Minority</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Community Classification</label>
                  <input
                    type="text"
                    name="community"
                    value={profileData.community || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Annual Family Income (₹)</label>
                  <input
                    type="number"
                    name="annual_income"
                    value={profileData.annual_income || 180000}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
                  />
                </div>

              </div>
            </div>

            {/* Section 3: Academic Details */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                3. Academic Enrollment Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Course</label>
                  <input
                    type="text"
                    name="current_course"
                    value={profileData.current_course || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Institution Name</label>
                  <input
                    type="text"
                    name="institution_name"
                    value={profileData.institution_name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qualifying Score Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="marks_percentage"
                    value={profileData.marks_percentage || 84.5}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
                  />
                </div>

              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? "Saving Changes..." : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
