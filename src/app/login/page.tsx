"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Lock, LogIn, Loader2, Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/useUserStore";
import Swal from "sweetalert2";
import { getDashboardRedirectPath, getHighestRole } from "@/utils/roleRedirect";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const { user, isAuthenticated, setUser, logout } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const getSmartRedirect = (userRoles: string[]) => {
    if (returnUrl && returnUrl !== "/" && !returnUrl.startsWith("/login")) {
      return returnUrl;
    }
    return getDashboardRedirectPath(userRoles);
  };

  // --- BULLETPROOF ZOMBIE STATE GUARD ---
  useEffect(() => {
    if (isAuthenticated) {
      // 1. Check if the physical token actually exists
      const token = Cookies.get("auth_token");

      if (token && user?.roles && user.roles.length > 0) {
        // Valid user + Valid token = Safe to redirect
        router.replace(getSmartRedirect(user.roles));
      } else {
        // ZOMBIE STATE: They have Zustand data but no token, or missing roles.
        // Force a clean slate so they stay on the login screen.
        logout();
      }
    }
  }, [isAuthenticated, user, router, returnUrl, logout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      if (response.status === 200) {
        const responseData = response.data.data ? response.data.data : response.data;
        const { token, user: loggedInUser } = responseData;

        if (!token) throw new Error("No token received from server");

        const isProduction = process.env.NODE_ENV === 'production';
        const primaryRole = getHighestRole(loggedInUser.roles || ['CUSTOMER']);

        Cookies.set("auth_token", token, {
          expires: 7,
          secure: isProduction,
          sameSite: 'lax',
          path: '/'
        });

        Cookies.set("user_role", primaryRole, {
          expires: 7,
          secure: isProduction,
          path: '/'
        });

        localStorage.setItem("token", token);
        setUser(loggedInUser);

        Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: `Logged in as ${loggedInUser.firstName}`,
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: "top-end"
        });

        setTimeout(() => {
          router.push(getSmartRedirect(loggedInUser.roles));
        }, 500);
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Invalid credentials. Please try again.",
        confirmButtonColor: "#0ea5e9"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) return null;

  // Check BOTH isAuthenticated AND if the token exists before showing the loading screen
  const hasToken = Cookies.get("token") || (typeof window !== 'undefined' ? localStorage.getItem("token") : null);
  if (isAuthenticated && user && hasToken) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-heading font-semibold animate-pulse">Taking you to your dashboard...</p>
      </div>
    );
  }

  // --- STANDARD LOGIN FORM ---
  return (
    <div className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-theme-lg transition-colors">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-heading mb-2">Welcome Back</h1>
        <p className="text-subheading">Sign in to your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Email, Phone, or Username</label>
          <div className="relative">
            <input
              type="text" name="identifier" required value={formData.identifier} onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all text-foreground"
              placeholder="Enter your login details"
            />
            <User className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">Password</label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange}
              className="w-full pl-10 pr-12 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all text-foreground"
              placeholder="••••••••"
            />
            <Lock className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
            <button
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          {!loading && <LogIn className="w-5 h-5" />}
        </button>
      </form>

      <p className="mt-8 text-center text-subheading text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary font-semibold hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-10 pb-28 md:pb-12 bg-gradient-theme">
      <Suspense fallback={<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}