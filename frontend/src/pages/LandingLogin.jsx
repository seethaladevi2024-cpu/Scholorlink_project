import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Lock, 
  ArrowRight, 
  Database, 
  Search, 
  Sparkles,
  UserCheck
} from "lucide-react";

export default function LandingLogin() {
  const navigate = useNavigate();
  const { register, login, setSheetStatus } = useAuth();

  // Mode: "register" (8 required fields) or "quick_login" (CAN / Email)
  const [formMode, setFormMode] = useState("register");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState(null);

  // 8 Mandatory Profile Fields from Official Specification
  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    dob: "",
    phone: "",
    email: "",
    can_number: "",
    caste: "OBC",
    community: "",
    annual_income: 180000,
    current_course: "B.Tech Computer Science & Engineering"
  });

  // Touched state for accessible inline validation
  const [touched, setTouched] = useState({});

  // Direct login state
  const [loginIdentifier, setLoginIdentifier] = useState("");

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation rules
  const errors = {};
  if (!formData.name.trim()) errors.name = "Full legal name is required.";
  if (!formData.gender) errors.gender = "Please select gender.";
  if (!formData.dob) errors.dob = "Date of birth is required.";
  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Enter a valid 10-digit mobile number.";
  }
  if (!formData.email.trim()) {
    errors.email = "Email ID is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!formData.can_number.trim()) {
    errors.can_number = "CAN Number (Candidate Application Number) is required.";
  } else if (formData.can_number.trim().length < 4) {
    errors.can_number = "CAN Number must be at least 4 characters.";
  }
  if (!formData.caste) errors.caste = "Please select caste category.";
  if (!formData.community.trim()) errors.community = "Community classification is required.";

  // Quick autofill for quick reviewer testing
  const autofillDemoStudent = () => {
    const randomCan = `CAN-2025-${Math.floor(10000 + Math.random() * 90000)}`;
    setFormData({
      name: "Rahul Verma",
      gender: "Male",
      dob: "2003-08-14",
      phone: "9876543210",
      email: `rahul.verma.${Math.floor(100 + Math.random() * 900)}@example.edu`,
      can_number: randomCan,
      caste: "OBC",
      community: "Backward Class (BC-C)",
      annual_income: 180000,
      current_course: "B.Tech Computer Science & Engineering"
    });
    setTouched({});
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessInfo(null);

    if (formMode === "register") {
      // Mark all fields touched
      const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {});
      setTouched(allTouched);

      if (Object.keys(errors).length > 0) {
        setErrorMessage("Please correct the highlighted fields before submitting.");
        return;
      }

      setLoading(true);
      try {
        const response = await register(formData);
        setSuccessInfo({
          title: "Registration & Profile Record Created",
          can: formData.can_number,
          sheetMsg: response.google_sheet_status?.message || "Google Sheet sync dispatched."
        });

        // Redirect to dashboard after brief confirmation
        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } catch (err) {
        setErrorMessage(err.message || "Failed to complete registration. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Direct Login Mode
      if (!loginIdentifier.trim()) {
        setErrorMessage("Please enter your registered Email ID or CAN Number.");
        return;
      }

      setLoading(true);
      try {
        await login(loginIdentifier.trim());
        navigate("/dashboard");
      } catch (err) {
        setErrorMessage(err.message || "Login failed. Check your Email or CAN Number.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* Top Banner Section */}
      <section className="bg-navy-950 text-white pt-10 pb-16 border-b border-navy-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          
          {/* Logo */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden bg-navy-900 border border-navy-700 p-1.5 shadow-lg flex items-center justify-center">
            <img 
              src="/scholarlink_logo.png" 
              alt="ScholarLink Logo" 
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            ScholarLink
          </h1>

          <p className="text-sm sm:text-base font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Scholarship Opportunity Intelligence Engine
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-900/80 border border-navy-700 text-xs text-slate-300 font-medium mb-4">
            <span>Discover</span>
            <span>•</span>
            <span>Explain</span>
            <span>•</span>
            <span>Verify</span>
            <span>•</span>
            <span>Assist</span>
          </div>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Your personalized gateway to relevant scholarship opportunities. Complete your profile once to automatically match, verify eligibility criteria, and track applications.
          </p>

        </div>
      </section>

      {/* Main Content: Form & Live Integration Status */}
      <main className="max-w-4xl mx-auto px-4 -mt-8 mb-16 w-full">
        
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Card Header & Mode Switcher */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Student Registration / Login
              </h2>
              <p className="text-xs text-slate-500">
                Enter your details to initiate AI-assisted eligibility matching
              </p>
            </div>

            <div className="flex bg-slate-200/80 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setFormMode("register"); setErrorMessage(""); }}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  formMode === "register" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                New Registration (8 Fields)
              </button>
              <button
                type="button"
                onClick={() => { setFormMode("quick_login"); setErrorMessage(""); }}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  formMode === "quick_login" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Direct Student Login
              </button>
            </div>
          </div>

          {/* Integration Status Pill */}
          <div className="px-6 py-2 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>
                Configured Storage Destination: <strong>Google Sheet (ID: 1xe5SWyK...)</strong>
              </span>
            </div>
            {formMode === "register" && (
              <button
                type="button"
                onClick={autofillDemoStudent}
                className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>Fill Sample Profile</span>
              </button>
            )}
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">

            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Submission Error: </span>
                  {errorMessage}
                </div>
              </div>
            )}

            {successInfo && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-sm text-emerald-950">{successInfo.title}</div>
                  <div>Candidate Application Number: <span className="font-mono font-semibold">{successInfo.can}</span></div>
                  <div className="text-slate-600 text-[11px]">{successInfo.sheetMsg}</div>
                  <div className="text-emerald-700 font-medium pt-1">Redirecting to Student Dashboard...</div>
                </div>
              </div>
            )}

            {formMode === "register" ? (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* 1. Name */}
                  <div>
                    <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      1. Student Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="e.g. Rahul Verma"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("name")}
                      aria-describedby={touched.name && errors.name ? "name-error" : undefined}
                      className={`w-full px-3 py-2 text-sm rounded-md border transition-colors ${
                        touched.name && errors.name
                          ? "border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500"
                          : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      }`}
                    />
                    {touched.name && errors.name && (
                      <p id="name-error" className="mt-1 text-xs text-rose-600">{errors.name}</p>
                    )}
                  </div>

                  {/* 2. Gender */}
                  <div>
                    <label htmlFor="reg-gender" className="block text-xs font-semibold text-slate-700 mb-1">
                      2. Gender <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="reg-gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      onBlur={() => handleBlur("gender")}
                      className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  {/* 3. Date of Birth */}
                  <div>
                    <label htmlFor="reg-dob" className="block text-xs font-semibold text-slate-700 mb-1">
                      3. Date of Birth <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-dob"
                      name="dob"
                      type="date"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      onBlur={() => handleBlur("dob")}
                      aria-describedby={touched.dob && errors.dob ? "dob-error" : undefined}
                      className={`w-full px-3 py-2 text-sm rounded-md border transition-colors ${
                        touched.dob && errors.dob
                          ? "border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500"
                          : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      }`}
                    />
                    {touched.dob && errors.dob && (
                      <p id="dob-error" className="mt-1 text-xs text-rose-600">{errors.dob}</p>
                    )}
                  </div>

                  {/* 4. Phone Number */}
                  <div>
                    <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      4. Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur("phone")}
                      aria-describedby={touched.phone && errors.phone ? "phone-error" : undefined}
                      className={`w-full px-3 py-2 text-sm rounded-md border transition-colors ${
                        touched.phone && errors.phone
                          ? "border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500"
                          : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      }`}
                    />
                    {touched.phone && errors.phone && (
                      <p id="phone-error" className="mt-1 text-xs text-rose-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* 5. Email ID */}
                  <div>
                    <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      5. Email ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="student@example.edu"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                      className={`w-full px-3 py-2 text-sm rounded-md border transition-colors ${
                        touched.email && errors.email
                          ? "border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500"
                          : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      }`}
                    />
                    {touched.email && errors.email && (
                      <p id="email-error" className="mt-1 text-xs text-rose-600">{errors.email}</p>
                    )}
                  </div>

                  {/* 6. CAN Number */}
                  <div>
                    <label htmlFor="reg-can" className="block text-xs font-semibold text-slate-700 mb-1">
                      6. CAN Number (Candidate Application Number) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-can"
                      name="can_number"
                      type="text"
                      required
                      placeholder="e.g. CAN-2025-98241"
                      value={formData.can_number}
                      onChange={handleChange}
                      onBlur={() => handleBlur("can_number")}
                      aria-describedby={touched.can_number && errors.can_number ? "can-error" : undefined}
                      className={`w-full px-3 py-2 text-sm font-mono rounded-md border transition-colors ${
                        touched.can_number && errors.can_number
                          ? "border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500"
                          : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      }`}
                    />
                    {touched.can_number && errors.can_number && (
                      <p id="can-error" className="mt-1 text-xs text-rose-600">{errors.can_number}</p>
                    )}
                  </div>

                  {/* 7. Caste */}
                  <div>
                    <label htmlFor="reg-caste" className="block text-xs font-semibold text-slate-700 mb-1">
                      7. Caste Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="reg-caste"
                      name="caste"
                      value={formData.caste}
                      onChange={handleChange}
                      onBlur={() => handleBlur("caste")}
                      className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="OBC">OBC (Other Backward Classes)</option>
                      <option value="SC">SC (Scheduled Caste)</option>
                      <option value="ST">ST (Scheduled Tribe)</option>
                      <option value="General">General / Open Category</option>
                      <option value="EWS">EWS (Economically Weaker Section)</option>
                      <option value="Minority">Minority Community</option>
                    </select>
                  </div>

                  {/* 8. Community */}
                  <div>
                    <label htmlFor="reg-community" className="block text-xs font-semibold text-slate-700 mb-1">
                      8. Community Classification <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-community"
                      name="community"
                      type="text"
                      required
                      placeholder="e.g. Backward Class (BC-C)"
                      value={formData.community}
                      onChange={handleChange}
                      onBlur={() => handleBlur("community")}
                      aria-describedby={touched.community && errors.community ? "community-error" : undefined}
                      className={`w-full px-3 py-2 text-sm rounded-md border transition-colors ${
                        touched.community && errors.community
                          ? "border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500"
                          : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      }`}
                    />
                    {touched.community && errors.community && (
                      <p id="community-error" className="mt-1 text-xs text-rose-600">{errors.community}</p>
                    )}
                  </div>

                </div>

                {/* Primary CTA */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Submitted profile is securely encrypted and validated via server-side storage.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 rounded-md bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing Profile...</span>
                      </>
                    ) : (
                      <>
                        <span>LOGIN / SUBMIT</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            ) : (
              // Direct Login Mode
              <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto py-4">
                <div>
                  <label htmlFor="login-id" className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Email ID or CAN Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="login-id"
                    type="text"
                    required
                    placeholder="rahul.verma@example.edu or CAN-2025-98241"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-md border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Enter the email address or candidate application number used during registration.
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => { setLoginIdentifier("CAN-2025-98241"); }}
                    className="text-blue-600 hover:underline"
                  >
                    Use sample registered student (Rahul Verma)
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-md bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Session...</span>
                    </>
                  ) : (
                    <>
                      <span>LOGIN / SUBMIT</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>

      </main>

      {/* Bottom Information Section */}
      <section className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. Instructions */}
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Instructions</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete your profile accurately to receive more relevant scholarship opportunities. Accurate entry of community, caste, and income data ensures optimal AI match precision.
              </p>
            </div>

            {/* 2. Guidelines */}
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Guidelines</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keep your documents ready for verification. Income Certificates, Caste Certificates, and Academic Marksheets must be valid, clearly scanned, and officially certified.
              </p>
            </div>

            {/* 3. About ScholarLink */}
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>About ScholarLink</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ScholarLink helps students discover, understand, verify and track scholarship opportunities through intelligence-guided eligibility assessment and automated verification.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
