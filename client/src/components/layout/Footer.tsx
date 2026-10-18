'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, PhoneCall, ShieldCheck, ExternalLink, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const { t } = useAuth();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-auto">
      {/* Emergency Farmer Support Banner */}
      <div className="bg-emerald-950 border-b border-emerald-900/60 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-300">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">National Toll-Free Kisan Call Centre</p>
              <p className="text-sm font-bold text-white">Call 1800-180-1551 (6:00 AM to 10:00 PM, All 7 Days)</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-900/50 px-3 py-1.5 rounded-full border border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Government Verified Information & Direct Farmer Market Linkage</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">Agri<span className="text-emerald-500">Connect</span></span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Empowering India's farming communities by uniting live mandi prices, hyper-local weather alerts, rule-based government schemes, and a direct buyer marketplace.
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/mandi-prices" className="hover:text-emerald-400 transition">Mandi Price Dashboard</Link></li>
              <li><Link href="/weather" className="hover:text-emerald-400 transition">Weather & Rule Alerts</Link></li>
              <li><Link href="/schemes" className="hover:text-emerald-400 transition">Government Scheme Directory</Link></li>
              <li><Link href="/marketplace" className="hover:text-emerald-400 transition">Direct Produce Marketplace</Link></li>
              <li><Link href="/support" className="hover:text-emerald-400 transition">District Officer Assistance</Link></li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Role Workspaces</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/farmer" className="hover:text-emerald-400 transition">🌾 Farmer Hub & Harvests</Link></li>
              <li><Link href="/buyer" className="hover:text-emerald-400 transition">🛒 Buyer Purchase Portal</Link></li>
              <li><Link href="/officer" className="hover:text-emerald-400 transition">🏛️ Agricultural Officer Desk</Link></li>
              <li><Link href="/admin" className="hover:text-emerald-400 transition">👑 Operations & System Logs</Link></li>
            </ul>
          </div>

          {/* Official Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Official Resources</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="https://agmarknet.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-400">
                  <span>Agmarknet Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-400">
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://kalia.odisha.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-400">
                  <span>KALIA Portal Odisha</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://mausam.imd.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-400">
                  <span>IMD Mausam Weather</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <p>© 2026 AgriConnect — Smart Farmer Assistance Platform. Built for Indian Agriculture.</p>
          <p className="flex items-center gap-1">
            Empowering Kisan with technology & transparency <Heart className="w-3 h-3 text-emerald-500 fill-emerald-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
