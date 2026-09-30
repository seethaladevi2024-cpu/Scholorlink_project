import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("scholarlink_token") || null);
  const [loading, setLoading] = useState(true);
  const [sheetStatus, setSheetStatus] = useState(null);

  // Initialize or fetch current user on mount
  useEffect(() => {
    async function loadUser() {
      try {
        if (token) {
          const userData = await api.getCurrentUser();
          setUser(userData);
        } else {
          // Default initial session for preview/exploration as Rahul Verma
          const fallbackUser = {
            id: 1,
            email: "rahul.verma@example.edu",
            full_name: "Rahul Verma",
            role: "STUDENT",
            is_active: true,
            profile: {
              name: "Rahul Verma",
              gender: "Male",
              dob: "2003-08-14",
              phone: "9876543210",
              email: "rahul.verma@example.edu",
              can_number: "CAN-2025-98241",
              caste: "OBC",
              community: "Backward Class (BC-C)",
              annual_income: 180000,
              current_course: "B.Tech Computer Science & Engineering",
              institution_name: "National Institute of Technology",
              marks_percentage: 84.5,
              completion_percentage: 85,
              google_synced: true,
              google_sync_notes: "Connected to Sheet ID 1xe5SWyKWt9Zmhcrw4zA3F6uBS3e_OsDbT63rHR0kmSg"
            }
          };
          setUser(fallbackUser);
        }
      } catch (err) {
        console.warn("Session restore fallback:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (emailOrCan, password = "student123") => {
    setLoading(true);
    try {
      const res = await api.login({ email_or_can: emailOrCan, password });
      localStorage.setItem("scholarlink_token", res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (studentPayload) => {
    setLoading(true);
    try {
      const res = await api.register(studentPayload);
      localStorage.setItem("scholarlink_token", res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      if (res.google_sheet_status) {
        setSheetStatus(res.google_sheet_status);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (targetRole) => {
    try {
      if (token) {
        const res = await api.switchRole(targetRole);
        setUser(res.user);
      } else {
        // Mock state switcher for client-side demo
        setUser((prev) => {
          if (!prev) return prev;
          let newName = prev.full_name;
          let newEmail = prev.email;
          if (targetRole === "ADMIN") {
            newName = "Dr. Aruna Sengupta";
            newEmail = "admin@scholarlink.gov.in";
          } else if (targetRole === "VERIFIER") {
            newName = "Sanjay Sharma";
            newEmail = "officer.sharma@scholarlink.gov.in";
          } else {
            newName = "Rahul Verma";
            newEmail = "rahul.verma@example.edu";
          }
          return {
            ...prev,
            role: targetRole,
            full_name: newName,
            email: newEmail
          };
        });
      }
    } catch (err) {
      console.error("Error switching role:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("scholarlink_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        role: user?.role || "STUDENT",
        loading,
        sheetStatus,
        setSheetStatus,
        login,
        register,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
