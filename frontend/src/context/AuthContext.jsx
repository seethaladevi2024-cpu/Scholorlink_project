import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const fallbackUser = {
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(fallbackUser);
  const [token, setToken] = useState(localStorage.getItem("scholarlink_token") || null);
  const [loading, setLoading] = useState(true);
  const [sheetStatus, setSheetStatus] = useState(null);

  // Initialize or fetch current user on mount
  useEffect(() => {
    async function loadUser() {
      try {
        if (token) {
          const userData = await api.getCurrentUser();
          if (userData && (userData.id || userData.email || userData.full_name)) {
            setUser(userData);
          } else {
            setUser(fallbackUser);
          }
        } else {
          // Default initial session for preview/exploration as Rahul Verma
          setUser(fallbackUser);
        }
      } catch (err) {
        console.warn("Session restore fallback:", err);
        setUser(fallbackUser);
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
      if (res && res.access_token) {
        localStorage.setItem("scholarlink_token", res.access_token);
        setToken(res.access_token);
      }
      if (res && res.user) {
        setUser(res.user);
      } else {
        setUser(fallbackUser);
      }
      return res;
    } catch (err) {
      setUser(fallbackUser);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (studentPayload) => {
    setLoading(true);
    try {
      const res = await api.register(studentPayload);
      if (res && res.access_token) {
        localStorage.setItem("scholarlink_token", res.access_token);
        setToken(res.access_token);
      }
      if (res && res.user) {
        setUser(res.user);
      } else {
        setUser({
          id: 99,
          email: studentPayload.email,
          full_name: studentPayload.name,
          role: "STUDENT",
          is_active: true,
          profile: {
            ...studentPayload,
            completion_percentage: 85,
            google_synced: true,
            google_sync_notes: "Google Sheet destination configured."
          }
        });
      }
      if (res && res.google_sheet_status) {
        setSheetStatus(res.google_sheet_status);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (targetRole) => {
    try {
      const res = await api.switchRole(targetRole);
      if (res && res.user) {
        setUser(res.user);
      } else {
        setUser((prev) => {
          const current = prev || fallbackUser;
          let newName = current.full_name;
          let newEmail = current.email;
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
            ...current,
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
    setUser(fallbackUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || fallbackUser,
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
