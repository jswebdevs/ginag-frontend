"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";
import { useUserStore } from "@/store/useUserStore";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user, isAuthenticated } = useUserStore(); 
  
  // FIX: Safely extract the role regardless of whether the interface uses 'role', 'roles' string, or 'roles' array
  useEffect(() => {
    const userRole = (user as any)?.role || (user as any)?.roles?.[0] || (user as any)?.roles;
    
    if (isAuthenticated && userRole) {
      const rolePath = String(userRole).toLowerCase().replace('_', '-');
      const targetDashboard = rolePath === 'customer' ? '/dashboard' : `/dashboard/${rolePath}`;
      router.replace(targetDashboard);
    }
  }, [isAuthenticated, user, router]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/users/register", formData);
      
      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-10 pb-28 md:pb-12 bg-gradient-theme">
        <div className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-theme-lg text-center transition-colors">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-heading">Check your email!</h2>
          <p className="text-subheading mb-6">
            We've sent a verification link to <span className="font-semibold text-foreground">{formData.email}</span>.
          </p>
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-10 pb-28 md:pb-12 bg-gradient-theme">
      <div className="max-w-xl w-full bg-card border border-border p-8 rounded-2xl shadow-theme-lg transition-colors">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-heading mb-2">Create an Account</h1>
          <p className="text-subheading">Join Dream Shop today.</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-6 text-sm text-center border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">First Name</label>
              <div className="relative">
                <input 
                  type="text" name="firstName" required value={formData.firstName} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring outline-none transition-all text-foreground" 
                  placeholder="John" 
                />
                <User className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Last Name</label>
              <div className="relative">
                <input 
                  type="text" name="lastName" required value={formData.lastName} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring outline-none transition-all text-foreground" 
                  placeholder="Doe" 
                />
                <User className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Username</label>
            <div className="relative">
              <input 
                type="text" name="username" required value={formData.username} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring outline-none transition-all text-foreground" 
                placeholder="johndoe123" 
              />
              <span className="absolute left-3 top-2.5 text-muted-foreground font-bold">@</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <input 
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring outline-none transition-all text-foreground" 
                  placeholder="john@example.com" 
                />
                <Mail className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <div className="relative">
                <input 
                  type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring outline-none transition-all text-foreground" 
                  placeholder="017XXXXXXXX" 
                />
                <Phone className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" required minLength={6} value={formData.password} onChange={handleChange}
                className="w-full pl-10 pr-12 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring outline-none transition-all text-foreground" 
                placeholder="••••••••" 
              />
              <Lock className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="mt-6 text-center text-subheading text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}