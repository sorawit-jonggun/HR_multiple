"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserPermissions, UserRole, Permission } from "@/types/roles";
import { calculatePermissions, hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/permissions";
import { clearAuthStorage } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  userPermissions: UserPermissions | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasRole: (role: UserRole) => boolean;
  /**
   * เปลี่ยน Role ปัจจุบัน (ใช้สำหรับ Mock UI)
   */
  setMockRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ROLE: UserRole = UserRole.SUPER_ADMIN;

function createMockUserAndPermissions(role: UserRole): { user: User; userPermissions: UserPermissions } {
  const roles: UserRole[] = [role];
  const permissions = calculatePermissions(roles);

  const user: User = {
    user_id: 1,
    username: role.toLowerCase().replace(/\s+/g, "_"),
    display_name: `${role} Mock User`,
    position_name: role,
    role,
    roles,
    company_id: "company-a",
    department_id: "dept-hr-a",
    email: `${role.toLowerCase().replace(/\s+/g, ".")}@mock.local`,
  };

  const userPermissions: UserPermissions = {
    roles,
    permissions,
    companyId: "company-a",
    departmentId: "dept-hr-a",
  };

  return { user, userPermissions };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize mock auth on mount (no real token / API)
  useEffect(() => {
    try {
      // เคลียร์ token เก่าออก (เลิกใช้ระบบ token จริง)
      clearAuthStorage();

      const storedRole = (typeof window !== "undefined"
        ? (localStorage.getItem("mockRole") as UserRole | null)
        : null) || DEFAULT_ROLE;

      const { user: mockUser, userPermissions: mockPerms } = createMockUserAndPermissions(storedRole);
      setUser(mockUser);
      setUserPermissions(mockPerms);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth mock initialization error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkPermission = (permission: Permission): boolean => {
    if (!userPermissions) return false;
    return hasPermission(userPermissions.permissions, permission);
  };

  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (!userPermissions) return false;
    return hasAnyPermission(userPermissions.permissions, permissions);
  };

  const checkAllPermissions = (permissions: Permission[]): boolean => {
    if (!userPermissions) return false;
    return hasAllPermissions(userPermissions.permissions, permissions);
  };

  const checkRole = (role: UserRole): boolean => {
    if (!userPermissions) return false;
    return userPermissions.roles.includes(role);
  };

  const setMockRole = (role: UserRole) => {
    const { user: mockUser, userPermissions: mockPerms } = createMockUserAndPermissions(role);
    setUser(mockUser);
    setUserPermissions(mockPerms);
    setIsAuthenticated(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("mockRole", role);
    }
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
    setUserPermissions(null);
    setIsAuthenticated(false);

    // ในโหมด mock ให้กลับไปหน้า dashboard เปล่าๆ แทนการบังคับ login
    if (typeof window !== "undefined") {
      window.location.replace("/dashboard");
    }
  };

  const value: AuthContextType = {
    user,
    userPermissions,
    loading,
    isAuthenticated,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
    hasRole: checkRole,
    setMockRole,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
