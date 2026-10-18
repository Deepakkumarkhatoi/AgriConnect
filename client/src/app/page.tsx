'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole, DEMO_CREDENTIALS, getDashboardPathForRole } from '../context/AuthContext';
import { FALLBACK_DATA } from '../lib/api';
import {
  Sprout,
  TrendingUp,
  CloudSun,
  FileText,
  Store,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  MapPin,
  Sparkles,
  ChevronRight,
  Search,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, t, quickLoginAs } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleHomeQuickLogin = async (role: UserRole) => {
    await quickLoginAs(role);
    router.push(getDashboardPathForRole(role));
  };

  const mandiPrices = FALLBACK_DATA.mandiPrices;
  const schemes = FALLBACK_DATA.schemes;
  const listings = FALLBACK_DATA.listings;
  const weather = FALLBACK_DATA.weather;

  const filteredPrices = mandiPrices.filter(
    (p) =>
      p.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* 1. Hero Section with Emerald/Forest Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-forest-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/50 border border-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Smart Agriculture & Marketplace Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              One Unified Hub for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-amber-300">India&apos;s Farmers</span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-2xl mx-auto">
              Compare mandi prices in real-time, get microclimate weather alerts, check government scheme eligibility, and sell directly to verified buyers without middlemen.
            </p>

            {/* Quick Role Access Buttons with Distinct Passwords */}
            <div className="pt-4">
              <p className="text-xs uppercase font-bold tracking-widest text-emerald-300 mb-3">
                {t.quickDemoLogin} — Test As Role (4 Distinct Passwords):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto">
                {(Object.keys(DEMO_CREDENTIALS) as UserRole[]).map((r) => {
                  const cred = DEMO_CREDENTIALS[r];
                  const isActive = user?.role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => handleHomeQuickLogin(r)}
                      className={`p-3 rounded-2xl text-left transition flex flex-col justify-between ${
                        isActive
                          ? 'bg-emerald-500 text-white shadow-lg ring-2 ring-emerald-300'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{cred.icon}</span>
                        <span className="text-[9px] font-mono font-bold bg-black/25 px-1.5 py-0.5 rounded text-emerald-200">
                          {cred.pass}
                        </span>
                      </div>
                      <p className="text-xs font-bold capitalize">{cred.title}</p>
                      <p className="text-[10px] text-emerald-100/80 truncate">{cred.name.split(' ')[0]}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              <Link
                href={user ? getDashboardPathForRole(user.role) : '/login'}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 hover:scale-102 transition"
              >
                <span>Launch {user ? `${user.role.toUpperCase()} Dashboard` : 'Dashboard Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition"
              >
                <span>Register with Role</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-2xl sm:text-3xl font-black text-amber-300">2,850+</p>
              <p className="text-xs text-emerald-100 font-medium mt-1">Live Mandi Prices</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-2xl sm:text-3xl font-black text-emerald-300">₹6,000+</p>
              <p className="text-xs text-emerald-100 font-medium mt-1">Direct Scheme Benefits</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-2xl sm:text-3xl font-black text-blue-300">100%</p>
              <p className="text-xs text-emerald-100 font-medium mt-1">Direct Buyer Connection</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-2xl sm:text-3xl font-black text-purple-300">24h</p>
              <p className="text-xs text-emerald-100 font-medium mt-1">Officer Grievance SLA</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Real-Time Mandi Price Ticker & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200/80 p-5 sm:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">{t.mandiTitle}</h2>
                <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  Live Agmarknet
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">{t.mandiSubtitle}</p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Mandi Price Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {filteredPrices.slice(0, 4).map((price) => (
              <div
                key={price._id}
                className="p-4 rounded-xl border border-stone-200/70 hover:border-emerald-300 hover:shadow-md transition bg-gradient-to-br from-white to-stone-50/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">{price.crop}</h3>
                    <p className="text-xs text-stone-500">{price.variety}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                      price.priceTrend === 'up'
                        ? 'bg-green-100 text-green-800'
                        : price.priceTrend === 'down'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {price.priceTrend.toUpperCase()}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-emerald-900">₹{price.modalPrice}</span>
                    <span className="text-[11px] text-stone-500 font-medium">/ quintal</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                    <span>Min: ₹{price.minPrice}</span>
                    <span>Max: ₹{price.maxPrice}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {price.market}, {price.district}
                  </span>
                  <span>{price.state}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/mandi-prices"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <span>View All 20+ Mandi Price Comparisons & Historical Charts</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Live Weather Alerts & Agricultural Advisories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CloudSun className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-black">{t.weatherTitle}</h2>
              </div>
              <p className="text-xs text-emerald-200">
                Microclimate forecast for {weather.district}, {weather.state} — updated at {weather.current.updatedAt}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md">
              <span className="text-3xl font-black text-amber-300">{weather.current.temp}°C</span>
              <div className="text-xs">
                <p className="font-bold">{weather.current.condition}</p>
                <p className="text-emerald-200 text-[11px]">Humidity: {weather.current.humidity}% | Rain: {weather.current.rainfallProbability}%</p>
              </div>
            </div>
          </div>

          {/* Active Rule Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {weather.alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-md space-y-2 hover:bg-white/15 transition"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="font-bold text-sm text-amber-300">{alert.title}</h4>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed">{alert.description}</p>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-[11px] text-emerald-200 font-medium">
                    <strong className="text-white">Action:</strong> {alert.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-right">
            <Link
              href="/weather"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white"
            >
              <span>View 7-day Rainfall Forecast & Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Direct Produce Marketplace Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-700" />
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">{t.marketplaceTitle}</h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">Buy directly from verified farmers at transparent fair rates</p>
          </div>
          <Link
            href="/marketplace"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            <span>Browse All Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="h-44 relative overflow-hidden bg-stone-100">
                <img
                  src={item.images[0]}
                  alt={item.crop}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-800 shadow-xs">
                  {item.qualityGrade}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[10px] font-medium">
                  {item.quantityAvailable} {item.unit} available
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{item.crop}</h3>
                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    {item.village}, {item.district}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-stone-400 font-medium">Expected Price</span>
                    <p className="text-base font-extrabold text-emerald-800">₹{item.pricePerUnit} <span className="text-xs font-normal text-stone-500">/{item.unit}</span></p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                    Producer: {item.farmerName.split(' ')[0]}
                  </span>
                </div>

                <Link
                  href={`/marketplace`}
                  className="w-full py-2 rounded-xl bg-stone-100 hover:bg-emerald-600 hover:text-white text-stone-800 text-xs font-bold text-center transition"
                >
                  Make Purchase Offer
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Government Schemes & Eligibility Checker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200/80">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900">{t.schemesTitle}</h2>
              </div>
              <p className="text-xs text-stone-600 mt-1">Rule-based preliminary eligibility checker with direct application links</p>
            </div>
            <Link
              href="/schemes"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
            >
              Test Eligibility Checker
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.slice(0, 2).map((scheme) => (
              <div
                key={scheme._id}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                      {scheme.category}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-1.5">{scheme.title}</h3>
                  </div>
                  <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                    {scheme.state}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{scheme.description}</p>

                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                  <strong>Key Benefits:</strong> {scheme.benefits}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-stone-500 text-[11px]">Department: {scheme.department}</span>
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    {t.applyNow} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Officer Support & Grievance SLA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>Government Verified Agricultural Extension</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black">Facing Crop Pests or Scheme Issues?</h2>
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
              Upload a photograph of your crop leaf symptoms or describe your scheme obstacle. Your ticket is routed directly to your District Agricultural Officer (DAO) for prompt resolution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/support"
              className="px-6 py-3 rounded-xl bg-white text-blue-950 font-bold text-sm shadow-md hover:bg-blue-50 transition text-center"
            >
              Raise Assistance Ticket
            </Link>
            <button
              onClick={() => quickLoginAs('officer')}
              className="px-5 py-3 rounded-xl bg-blue-800/80 hover:bg-blue-700 text-white font-bold text-sm border border-blue-600 transition text-center"
            >
              Login as Agri Officer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
