'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole, DEMO_CREDENTIALS, getDashboardPathForRole } from '../../context/AuthContext';
import { ShieldAlert, Lock, ArrowRight, UserCheck, LogIn, UserPlus, RefreshCw } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  dashboardName: string;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, dashboardName, children }) => {
  const { user, isInitialized, isLoading, quickLoginAs, logout } = useAuth();
  const router = useRouter();

  // 1. Initial hydration / local storage loading state
  if (!isInitialized) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mb-4" />
        <p className="text-sm font-semibold text-stone-600">Verifying RBAC security credentials...</p>
      </div>
    );
  }

  // 2. Unauthenticated User (Guest)
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto my-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200/80 p-8 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            RBAC Protected Workspace
          </span>

          <h2 className="text-2xl font-black text-stone-900 mt-4">
            Sign In to Access {dashboardName}
          </h2>

          <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto">
            This dashboard requires authenticated credentials for{' '}
            <strong className="text-emerald-800">{allowedRoles.map((r) => r.toUpperCase()).join(' or ')}</strong>.
            Please sign in with your email or test immediately with a role below.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Your Account
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 text-stone-800 rounded-xl font-semibold text-sm hover:bg-stone-200 transition"
            >
              <UserPlus className="w-4 h-4" />
              Register New Account
            </Link>
          </div>

          {/* Quick Demo Role Picker for Testing */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
              Or Instant One-Click Test As Role
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left">
              {(Object.keys(DEMO_CREDENTIALS) as UserRole[]).map((r) => {
                const cred = DEMO_CREDENTIALS[r];
                const isTarget = allowedRoles.includes(r);
                return (
                  <button
                    key={r}
                    onClick={async () => {
                      await quickLoginAs(r);
                      router.push(getDashboardPathForRole(r));
                    }}
                    disabled={isLoading}
                    className={`p-3 rounded-xl border text-xs transition flex flex-col justify-between ${
                      isTarget
                        ? 'border-emerald-400 bg-emerald-50/70 hover:bg-emerald-100 shadow-xs ring-1 ring-emerald-400'
                        : 'border-stone-200 bg-white hover:bg-stone-50 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg">{cred.icon}</span>
                        {isTarget && (
                          <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">
                            Authorized
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-stone-900 capitalize">{cred.title}</p>
                      <p className="text-[10px] text-stone-500 truncate">{cred.name}</p>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-mono mt-2 font-semibold">
                      Pass: {cred.pass}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated User with Unauthorized Role (RBAC Block)
  if (!allowedRoles.includes(user.role)) {
    const myDashboard = getDashboardPathForRole(user.role);

    return (
      <div className="max-w-2xl mx-auto my-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Access Restricted by RBAC Policy
          </span>

          <h2 className="text-2xl font-black text-stone-900 mt-4">
            Unauthorized Role for {dashboardName}
          </h2>

          <p className="text-sm text-stone-600 mt-2 max-w-lg mx-auto">
            This dashboard is strictly reserved for users with the role of{' '}
            <strong className="text-red-700">{allowedRoles.map((r) => r.toUpperCase()).join(' or ')}</strong>.
          </p>

          <div className="my-6 p-4 bg-stone-50 rounded-xl border border-stone-200 text-left max-w-md mx-auto text-xs space-y-1.5">
            <p className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Your Current Active Profile:</p>
            <p className="text-sm font-bold text-stone-900 flex items-center justify-between">
              <span>{user.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 font-mono uppercase text-[11px]">
                {user.role}
              </span>
            </p>
            <p className="text-stone-500">{user.email}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={myDashboard}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition"
            >
              <span>Go to My Dashboard ({user.role.toUpperCase()})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-semibold text-sm hover:bg-stone-200 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Switch Account / Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Access
  return <>{children}</>;
};
