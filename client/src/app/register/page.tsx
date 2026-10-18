'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole, getDashboardPathForRole } from '../../context/AuthContext';
import {
  Sprout,
  Store,
  Building2,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Role-specific fields
  const [district, setDistrict] = useState('Puri');
  const [state, setState] = useState('Odisha');
  const [village, setVillage] = useState('Pipili');
  const [farmSizeAcres, setFarmSizeAcres] = useState('3.5');
  const [cropsGrown, setCropsGrown] = useState('Paddy, Mustard');
  const [organization, setOrganization] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const roleOptions: { role: UserRole; title: string; subtitle: string; icon: string }[] = [
    {
      role: 'farmer',
      title: 'Farmer (Kisan)',
      subtitle: 'Manage acreage, live Mandi intelligence & subsidies',
      icon: '🌾',
    },
    {
      role: 'buyer',
      title: 'Buyer / Trader',
      subtitle: 'Direct farm produce procurement & counter-bids',
      icon: '🛒',
    },
    {
      role: 'officer',
      title: 'Agricultural Officer',
      subtitle: 'District grievance desk & agronomic prescriptions',
      icon: '🏛️',
    },
    {
      role: 'admin',
      title: 'Administrator',
      subtitle: 'Platform verification, audit trail & operations hub',
      icon: '👑',
    },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    const res = await register({
      name,
      email,
      password,
      role: selectedRole,
      phone,
      district,
      state,
      village: selectedRole === 'farmer' ? village : undefined,
      farmSizeAcres: selectedRole === 'farmer' ? Number(farmSizeAcres) || 0 : undefined,
      cropsGrown: selectedRole === 'farmer' ? cropsGrown.split(',').map((c) => c.trim()) : undefined,
      organization: selectedRole === 'buyer' || selectedRole === 'officer' ? organization : undefined,
      jurisdiction: selectedRole === 'officer' ? jurisdiction || district : undefined,
    });

    if (res.success && res.role) {
      // Direct redirect to ONLY the registered user's dashboard!
      router.push(getDashboardPathForRole(res.role));
    } else {
      setErrorMsg(res.error || 'Registration failed. Please check the entered information.');
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-3xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center text-white mx-auto mb-4 shadow-md shadow-emerald-600/20">
            <Sprout className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Join the AgriConnect Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-3">
            Register Your Account with RBAC Role
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto">
            Choose your role to get dedicated access to your tailored platform dashboard.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Registration Alert</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Step 1: Select Role */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
              Select Your Platform Role (Determines Your Dashboard Access)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roleOptions.map((opt) => {
                const isSelected = selectedRole === opt.role;
                return (
                  <div
                    key={opt.role}
                    onClick={() => setSelectedRole(opt.role)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-500'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-stone-900">{opt.title}</p>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">{opt.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Personal & Contact Credentials */}
          <div className="pt-4 border-t border-stone-100">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
              Contact & Authentication Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Mohapatra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 bg-stone-50/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 bg-stone-50/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 bg-stone-50/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">District / Region</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Puri, Khordha, Cuttack"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 bg-stone-50/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 bg-stone-50/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Re-type password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 bg-stone-50/50 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Dynamic Role Context Fields */}
          {selectedRole === 'farmer' && (
            <div className="pt-4 border-t border-stone-100 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-700" />
                Farmer Agronomic Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Village / GP</label>
                  <input
                    type="text"
                    placeholder="e.g. Pipili"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Holding (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 3.5"
                    value={farmSizeAcres}
                    onChange={(e) => setFarmSizeAcres(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Primary Crops Grown</label>
                  <input
                    type="text"
                    placeholder="Paddy, Mustard, Dal"
                    value={cropsGrown}
                    onChange={(e) => setCropsGrown(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {(selectedRole === 'buyer' || selectedRole === 'officer') && (
            <div className="pt-4 border-t border-stone-100 bg-amber-50/40 p-4 rounded-2xl border border-amber-100">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-700" />
                {selectedRole === 'buyer' ? 'Trading Entity Details' : 'Official Designation & Jurisdiction'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {selectedRole === 'buyer' ? 'Company / Firm Name' : 'Government Department / Office'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === 'buyer' ? 'e.g. Ananya Agro Traders' : 'Dept. of Agriculture, Odisha'}
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {selectedRole === 'buyer' ? 'Operating Jurisdiction' : 'Official Jurisdiction District'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Puri & Coastal Odisha"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating MongoDB User & Generating JWT Token...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Complete Registration & Open My Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-600">
            Already registered?
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-1 hover:underline"
          >
            <span>Sign In to Existing Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
