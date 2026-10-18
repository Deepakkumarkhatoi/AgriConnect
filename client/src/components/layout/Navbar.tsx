'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, UserRole, DEMO_CREDENTIALS, getDashboardPathForRole } from '../../context/AuthContext';
import { Language } from '../../i18n/translations';
import {
  Sprout,
  Store,
  CloudSun,
  FileText,
  HelpCircle,
  TrendingUp,
  LayoutDashboard,
  Globe,
  Bell,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, language, t, setLanguage, quickLoginAs, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const dashboardPath = user ? getDashboardPathForRole(user.role) : '/login';

  const navLinks = [
    { href: '/', label: t.navHome, icon: Sprout },
    { href: '/mandi-prices', label: t.navMandi, icon: TrendingUp },
    { href: '/weather', label: t.navWeather, icon: CloudSun },
    { href: '/schemes', label: t.navSchemes, icon: FileText },
    { href: '/marketplace', label: t.navMarketplace, icon: Store },
    { href: '/support', label: t.navSupport, icon: HelpCircle },
    {
      href: dashboardPath,
      label: user ? `${t.navDashboard} (${user.role.toUpperCase()})` : 'Dashboard',
      icon: LayoutDashboard,
      highlight: true,
    },
  ];

  const roleColors: Record<UserRole, string> = {
    farmer: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    buyer: 'bg-amber-100 text-amber-800 border-amber-300',
    officer: 'bg-blue-100 text-blue-800 border-blue-300',
    admin: 'bg-purple-100 text-purple-800 border-purple-300',
  };

  const handleRoleSwitch = async (role: UserRole) => {
    setShowRoleMenu(false);
    await quickLoginAs(role);
    router.push(getDashboardPathForRole(role));
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-100 shadow-xs bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-emerald-950">
                  Agri<span className="text-emerald-600">Connect</span>
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Bharat
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium hidden sm:block">
                Smart Farmer Assistance & Marketplace
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    link.highlight
                      ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 font-semibold'
                      : isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                      : 'text-stone-700 hover:text-emerald-800 hover:bg-emerald-50/60'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setShowRoleMenu(false);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span className="uppercase font-semibold">{language}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-50 animate-in fade-in slide-in-from-top-1">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 ${
                      language === 'en' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-stone-700'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('or');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 ${
                      language === 'or' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-stone-700'
                    }`}
                  >
                    <span>ଓଡ଼ିଆ (Odia)</span>
                    {language === 'or' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 ${
                      language === 'hi' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-stone-700'
                    }`}
                  >
                    <span>हिन्दी (Hindi)</span>
                    {language === 'hi' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowRoleMenu(false);
                  setShowLangMenu(false);
                }}
                className="relative p-2 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-100 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-xs font-bold text-stone-800">Alerts & Messages</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                      2 New
                    </span>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="p-2 bg-amber-50/60 rounded-lg border border-amber-200/50 text-xs">
                      <p className="font-semibold text-amber-900">Heavy Rainfall Advisory</p>
                      <p className="text-amber-800 text-[11px] mt-0.5">
                        Scattered showers forecasted in Puri & Khordha district. Clear drainage channels.
                      </p>
                      <span className="text-[9px] text-amber-700 mt-1 block">15 mins ago</span>
                    </div>
                    <div className="p-2 bg-emerald-50/60 rounded-lg border border-emerald-200/50 text-xs">
                      <p className="font-semibold text-emerald-900">Buyer Inquiry Received</p>
                      <p className="text-emerald-800 text-[11px] mt-0.5">
                        Ananya Agro Traders offered ₹2,280/q for Paddy.
                      </p>
                      <span className="text-[9px] text-emerald-700 mt-1 block">1 hour ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons or Role Switcher */}
            {!user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-xs flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            ) : null}

            {/* Test As Role Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowLangMenu(false);
                  setShowNotifMenu(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-xs transition hover:opacity-90 ${
                  user ? roleColors[user.role] : 'bg-stone-100 border-stone-300 text-stone-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="capitalize">{user ? user.role : 'Test As Role'}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  {user ? (
                    <div className="px-3 py-2 border-b border-stone-100 bg-stone-50/60 rounded-xl mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                          Active User
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase font-bold">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs font-black text-stone-900 mt-0.5 truncate">{user.name}</p>
                      <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                      
                      <Link
                        href={getDashboardPathForRole(user.role)}
                        onClick={() => setShowRoleMenu(false)}
                        className="mt-2 w-full py-1.5 px-2 bg-emerald-600 text-white rounded-lg text-xs font-bold text-center block hover:bg-emerald-700 transition"
                      >
                        Open My Dashboard ({user.role.toUpperCase()})
                      </Link>
                    </div>
                  ) : null}

                  <div className="py-1">
                    <div className="px-2 pb-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
                        Test As Role (4 Passwords)
                      </span>
                      <span className="text-[9px] text-emerald-700 font-semibold">1-Click Auth</span>
                    </div>

                    {(Object.keys(DEMO_CREDENTIALS) as UserRole[]).map((r) => {
                      const cred = DEMO_CREDENTIALS[r];
                      const isCurrent = user?.role === r;
                      return (
                        <button
                          key={r}
                          onClick={() => handleRoleSwitch(r)}
                          className={`w-full text-left p-2 rounded-xl text-xs transition flex items-center justify-between mb-1 ${
                            isCurrent
                              ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                              : 'text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{cred.icon}</span>
                            <div>
                              <p className="text-xs font-bold leading-tight">
                                {cred.title} <span className="text-[10px] text-stone-500 font-normal">({cred.name.split(' ')[0]})</span>
                              </p>
                              <p className="text-[10px] text-stone-400 font-mono">Pass: <strong className="text-emerald-700">{cred.pass}</strong></p>
                            </div>
                          </div>
                          {isCurrent ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-semibold shrink-0">Switch →</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {user && (
                    <div className="pt-2 border-t border-stone-100 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowRoleMenu(false);
                          router.push('/login');
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl font-semibold flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Account</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-emerald-100 overflow-x-auto text-xs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center py-1 px-2 rounded-md ${
                  isActive ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-stone-600 hover:text-emerald-600'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] whitespace-nowrap">{link.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
