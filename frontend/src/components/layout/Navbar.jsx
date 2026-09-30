import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  GraduationCap, 
  FileText, 
  Award, 
  FolderCheck, 
  HelpCircle, 
  ShieldCheck, 
  LogOut, 
  User, 
  Menu, 
  X,
  ChevronDown,
  Layers
} from "lucide-react";

export default function Navbar() {
  const { user, role, switchRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard", icon: Layers, roles: ["STUDENT", "VERIFIER", "ADMIN"] },
    { label: "Scholarships", path: "/scholarships", icon: Award, roles: ["STUDENT", "VERIFIER", "ADMIN"] },
    { label: "My Applications", path: "/applications", icon: FileText, roles: ["STUDENT"] },
    { label: "Documents", path: "/documents", icon: FolderCheck, roles: ["STUDENT"] },
    { label: "Guidelines", path: "/guidelines", icon: HelpCircle, roles: ["STUDENT", "VERIFIER", "ADMIN"] },
    { label: "Admin & Verification", path: "/admin", icon: ShieldCheck, roles: ["ADMIN", "VERIFIER"] },
  ];

  const visibleLinks = navLinks.filter(item => item.roles.includes(role));

  return (
    <header className="bg-navy-950 border-b border-navy-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Name */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-navy-900 border border-navy-700 p-1 flex items-center justify-center shadow-inner group-hover:border-blue-400 transition-colors">
              <img 
                src="/scholarlink_logo.png" 
                alt="ScholarLink Official Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  ScholarLink
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  Portal
                </span>
              </div>
              <span className="text-xs text-slate-400 font-normal tracking-wide hidden sm:block">
                Scholarship Opportunity Intelligence Engine
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {visibleLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-navy-800"
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Role Switcher & User Avatar */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* RBAC Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-300 transition-colors"
                title="Switch role for portal review"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Role: {role}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-navy-900 border border-navy-700 rounded-lg shadow-xl py-1 z-50 text-xs"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider border-b border-navy-800">
                    Switch Access Role
                  </div>
                  <button
                    onClick={() => { switchRole("STUDENT"); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-navy-800 ${role === "STUDENT" ? "text-blue-400 font-bold" : "text-slate-300"}`}
                  >
                    <span>Student (Candidate)</span>
                    {role === "STUDENT" && <span className="text-blue-400 text-xs">Active</span>}
                  </button>
                  <button
                    onClick={() => { switchRole("VERIFIER"); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-navy-800 ${role === "VERIFIER" ? "text-blue-400 font-bold" : "text-slate-300"}`}
                  >
                    <span>Verification Officer</span>
                    {role === "VERIFIER" && <span className="text-blue-400 text-xs">Active</span>}
                  </button>
                  <button
                    onClick={() => { switchRole("ADMIN"); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-navy-800 ${role === "ADMIN" ? "text-blue-400 font-bold" : "text-slate-300"}`}
                  >
                    <span>System Administrator</span>
                    {role === "ADMIN" && <span className="text-blue-400 text-xs">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* User Profile & Logout */}
            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-navy-800">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 group text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-xs ring-2 ring-blue-500/30 group-hover:ring-blue-400">
                    {user.full_name ? user.full_name.charAt(0) : "S"}
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 leading-tight">
                      {user.full_name || "Rahul Verma"}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight">
                      {user.profile?.can_number || user.email}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-navy-800 rounded transition-colors"
                  title="Secure Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/"
                className="px-4 py-2 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Login / Register
              </Link>
            )}

          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-navy-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-b border-navy-800 px-4 pt-2 pb-4 space-y-2">
          {visibleLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${
                  active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-navy-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-navy-800 flex flex-col gap-2">
            <div className="text-xs text-slate-400 font-medium px-1">Role: {role}</div>
            <div className="flex gap-2">
              <button
                onClick={() => { switchRole("STUDENT"); setMobileMenuOpen(false); }}
                className={`flex-1 text-center py-1.5 text-xs rounded border ${role === "STUDENT" ? "bg-blue-600 border-blue-500 text-white" : "border-navy-700 text-slate-300"}`}
              >
                Student
              </button>
              <button
                onClick={() => { switchRole("VERIFIER"); setMobileMenuOpen(false); }}
                className={`flex-1 text-center py-1.5 text-xs rounded border ${role === "VERIFIER" ? "bg-blue-600 border-blue-500 text-white" : "border-navy-700 text-slate-300"}`}
              >
                Verifier
              </button>
              <button
                onClick={() => { switchRole("ADMIN"); setMobileMenuOpen(false); }}
                className={`flex-1 text-center py-1.5 text-xs rounded border ${role === "ADMIN" ? "bg-blue-600 border-blue-500 text-white" : "border-navy-700 text-slate-300"}`}
              >
                Admin
              </button>
            </div>
            
            {user && (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-rose-900/40 text-rose-200 border border-rose-800 rounded text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
