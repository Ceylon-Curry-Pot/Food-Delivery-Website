"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, User, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AuthCard() {
  const router = useRouter();

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          password: signUpPassword,
          role: "staff",
          approved: false
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to sign up");
      }
      
      toast.success("Request submitted! Await admin approval.");
      setSignUpName("");
      setSignUpEmail("");
      setSignUpPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign up");
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.error("Contact your admin to reset your password.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row shadow-xl rounded-xl overflow-hidden border border-gray-100">
      {/* Login Panel */}
      <div className="w-full md:w-1/2 p-8 md:p-12 bg-white">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Staff Login</h2>
        
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-gray-400 text-sm" 
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-gray-400 text-sm" 
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
            className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loginLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* Sign Up Panel */}
      <div className="w-full md:w-1/2 p-8 md:p-12 bg-[#F8FAFC] border-t md:border-t-0 md:border-l border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Staff Sign Up</h2>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              required
              placeholder="Full Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-gray-400 text-sm bg-white" 
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="email" 
              required
              placeholder="Email address"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-gray-400 text-sm bg-white" 
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="password" 
              required
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-gray-400 text-sm bg-white" 
            />
          </div>

          <div className="bg-[#FEF9C3] border border-amber-200 rounded-lg p-3 flex items-start mt-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Your account requires admin approval before you can access the dashboard.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={signUpLoading}
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {signUpLoading ? "Submitting..." : "Request Access"}
          </button>
        </form>
      </div>
    </div>
  );
}
