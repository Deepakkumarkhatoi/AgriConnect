'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole, DEMO_CREDENTIALS, getDashboardPathForRole } from '../../context/AuthContext';
import {
  Sprout,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLoginAs, isLoading, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeQuickRole, setActiveQuickRole] = useState<UserRole | null>(null);

  // If already logged in, show quick redirect option
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success && res.role) {
      router.push(getDashboardPathForRole(res.role));
    } else {
      setErrorMsg(res.error || 'Invalid email or password. Please verify your credentials.');
    }
  };

  const handleTestAsRole = async (role: UserRole) => {
    setErrorMsg(null);
    setActiveQuickRole(role);
    const cred = DEMO_CREDENTIALS[role];
    setEmail(cred.email);
    setPassword(cred.pass);

    const res = await login(cred.email, cred.pass);
    if (res.success && res.role) {
      router.push(getDashboardPathForRole(res.role));
    } else {
      setErrorMsg(res.error || 'Quick login failed. Please try again.');
    }
    setActiveQuickRole(null);
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Test As Role Credentials Showcase */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-emerald-100 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                RBAC Multi-Role Access Control
              </p>
            </div>
            <h2 className="text-xl font-black text-stone-900">
              Role-Specific Credentials
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Each registered role has distinct credentials and can <strong>only access its authorized dashboard</strong>.
            </p>

            {/* 4 Demo Roles Cards */}
            <div className="mt-5 space-y-2.5">
              {(Object.keys(DEMO_CREDENTIALS) as UserRole[]).map((r) => {
                const cred = DEMO_CREDENTIALS[r];
                const isSelected = activeQuickRole === r;
                return (
                  <div
                    key={r}
                    onClick={() => handleTestAsRole(r)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer group hover:border-emerald-500 hover:shadow-md ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                        : 'bg-stone-50/70 border-stone-200/80 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{cred.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900">{cred.title}</span>
                            <span className="text-[10px] text-stone-500 font-medium truncate max-w-[120px]">
                              ({cred.name.split(' ')[0]})
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 font-mono">{cred.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-stone-200 text-emerald-800 block shadow-2xs">
                          {cred.pass}
                        </span>
                        <span className="text-[9px] text-emerald-700 font-bold group-hover:underline mt-0.5 inline-block">
                          Click to Sign In →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                JWT Auth & RBAC Guarded
              </span>
              <span>DB: MongoDB Atlas</span>
            </div>
          </div>
        </div>

        {/* Right Side: Sign In Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl relative">
          <div className="text-left mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center text-white mb-4 shadow-md shadow-emerald-600/20">
              <Sprout className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Sign In to AgriConnect
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Enter your credentials to access your personalized role workspace.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Failed</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. farmer@agriconnect.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-stone-50/50 transition outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-stone-400">
                  Demo Pass: <code className="text-emerald-700 font-bold">Farmer@123</code> etc.
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm pl-10 pr-11 py-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-stone-50/50 transition outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                <input type="checkbox" defaultChecked className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500" />
                <span>Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying with MongoDB...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Prompt */}
          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-600">
              Don&apos;t have an account registered yet?
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-1 hover:underline"
            >
              <span>Create a New Account with Role Selection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
