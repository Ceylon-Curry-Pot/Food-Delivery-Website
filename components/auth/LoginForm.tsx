"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
      });

      if (res?.error) {
        setLoginError(res.error || "Invalid email or password");
      } else {
        router.push("/admin/orders");
      }
    } catch (err) {
      setLoginError("An unexpected error occurred.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.error("Contact your admin to reset your password.");
  };

  return (
    <div className="w-full p-8 md:p-10 bg-white shadow-xl rounded-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Staff Login</h2>
      
      {loginError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {loginError}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="email" 
            required
            placeholder="Email address"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="text-black w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-gray-400 text-sm" 
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="password" 
            required
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="text-black w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-gray-400 text-sm" 
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-gray-600 cursor-pointer">
            <input type="checkbox" className="mr-2 rounded border-gray-300 text-brand focus:ring-brand" />
            Remember me
          </label>
          <button type="button" onClick={handleForgotPassword} className="text-brand hover:underline font-medium">
            Forgot password?
          </button>
        </div>

        <button 
          type="submit" 
          disabled={loginLoading}
          className="w-full mt-4 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loginLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

    </div>
  );
}
