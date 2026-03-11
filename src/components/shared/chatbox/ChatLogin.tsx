"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowRight, User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/useUserStore";
import Swal from "sweetalert2";

// Import the same role utility your main login uses
import { getHighestRole } from "@/utils/roleRedirect";

export default function ChatLogin({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) {
    const { setUser } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    // 🔥 SCROLL BLEED FIX: Locks the background so it cannot be scrolled
    useEffect(() => {
        // Only lock scroll on mobile devices where this is full screen
        if (window.innerWidth < 768) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/auth/login", formData);

            if (response.status === 200) {
                const responseData = response.data.data ? response.data.data : response.data;
                const { token, user: loggedInUser } = responseData;

                if (!token) throw new Error("No token received from server");

                const isProduction = process.env.NODE_ENV === 'production';

                // Fallback inline logic just in case getHighestRole fails in this context
                let primaryRole = 'CUSTOMER';
                try {
                    primaryRole = getHighestRole(loggedInUser.roles || []);
                } catch {
                    const ROLE_HIERARCHY = ['SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER', 'ORDER_MANAGER', 'DELIVERY_MANAGER', 'MARKETING_SPECIALIST', 'SUPPORT_AGENT', 'CUSTOMER'];
                    for (const rank of ROLE_HIERARCHY) {
                        if (loggedInUser.roles?.includes(rank)) {
                            primaryRole = rank; break;
                        }
                    }
                }

                // 1. Set Cookies (Matches your main login)
                Cookies.set("auth_token", token, { expires: 7, secure: isProduction, sameSite: 'lax', path: '/' });
                Cookies.set("user_role", primaryRole, { expires: 7, secure: isProduction, path: '/' });

                // 2. Set LocalStorage (Needed for the socket connection)
                localStorage.setItem("token", token);

                // 3. Sync Zustand State
                setUser(loggedInUser);

                Swal.fire({
                    icon: "success",
                    title: "Welcome Back!",
                    text: `Logged in to chat as ${loggedInUser.firstName}`,
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end"
                });

                // 4. Tell the ChatWidget to switch views
                onLoginSuccess(token);
            }
        } catch (err: any) {
            console.error("Chat Login Error:", err);
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: err.response?.data?.message || "Invalid credentials. Please try again.",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        // Added overscroll-none to further prevent scroll chaining on mobile
        <div className="flex flex-col flex-1 h-full w-full justify-center p-6 bg-background absolute inset-0 z-50 overscroll-none overflow-y-auto">

            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground">Sign In to Chat</h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">Please log in to speak with DreamBot.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">

                {/* Identifier Input */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest ml-1">Email or Username</label>
                    <div className="relative">
                        <input
                            type="text" name="identifier" required
                            value={formData.identifier} onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm text-foreground"
                            placeholder="Enter your details"
                        />
                        <User className="absolute left-3 top-3.5 text-muted-foreground w-4 h-4" />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest ml-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"} name="password" required
                            value={formData.password} onChange={handleChange}
                            className="w-full pl-10 pr-12 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm text-foreground"
                            placeholder="••••••••"
                        />
                        <Lock className="absolute left-3 top-3.5 text-muted-foreground w-4 h-4" />
                        <button
                            type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit" disabled={loading}
                    className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 mt-2"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <>Start Chatting <ArrowRight size={18} /></>}
                </button>
            </form>
        </div>
    );
}