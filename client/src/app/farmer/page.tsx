'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sprout,
  Store,
  FileText,
  Calendar,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Tag,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface MockCrop {
  id: string;
  name: string;
  variety: string;
  plotName: string;
  sowingDate: string;
  harvestDate: string;
  stage: 'sowing' | 'vegetative' | 'flowering' | 'ripening' | 'harvest_ready';
  expectedYieldQuintals: number;
  progressPercent: number;
}

export default function FarmerDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'crops' | 'farms' | 'listings' | 'schemes'>('crops');

  // Farm Plots
  const [farms, setFarms] = useState([
    { id: 'f1', name: 'Mahanadi Delta Main Plot', acres: 2.5, soil: 'Alluvial Loam', irrigation: 'Canal Flow', village: 'Pipili, Puri' },
    { id: 'f2', name: 'Riverbank Vegetable Patch', acres: 1.0, soil: 'Sandy Loam', irrigation: 'Drip & Borewell', village: 'Pipili, Puri' },
  ]);

  // Crop growth records
  const [crops, setCrops] = useState<MockCrop[]>([
    {
      id: 'c1',
      name: 'Paddy (Dhan)',
      variety: 'Swarna Sub-1',
      plotName: 'Mahanadi Delta Main Plot',
      sowingDate: '15 Jun 2026',
      harvestDate: '20 Nov 2026',
      stage: 'ripening',
      expectedYieldQuintals: 45,
      progressPercent: 82,
    },
    {
      id: 'c2',
      name: 'Mustard (Sarson)',
      variety: 'Pusa Bold',
      plotName: 'Riverbank Vegetable Patch',
      sowingDate: '05 Oct 2026',
      harvestDate: '25 Jan 2027',
      stage: 'vegetative',
      expectedYieldQuintals: 12,
      progressPercent: 30,
    },
  ]);

  // Farmer's Produce Listings & Buyer Inquiries
  const [myListings, setMyListings] = useState([
    {
      id: 'l1',
      crop: 'Paddy (Swarna Sub-1)',
      quantity: 35,
      unit: 'Quintal',
      price: 2350,
      status: 'active',
      inquiriesCount: 2,
    },
    {
      id: 'l2',
      crop: 'Mustard (Pusa Bold)',
      quantity: 15,
      unit: 'Quintal',
      price: 5600,
      status: 'active',
      inquiriesCount: 1,
    },
  ]);

  // Saved Schemes & Document Checklist
  const [savedSchemes, setSavedSchemes] = useState([
    {
      title: 'KALIA Scheme (Odisha Welfare)',
      benefit: '₹10,000/year assistance + ₹2 Lakh Insurance',
      checklist: [
        { item: 'Aadhaar Card copy', completed: true },
        { item: 'Land RoR (Patta) copy', completed: true },
        { item: 'Bank Passbook linking', completed: true },
      ],
    },
    {
      title: 'PM-KISAN Samman Nidhi',
      benefit: '₹6,000 yearly DBT in 3 installments',
      checklist: [
        { item: 'Aadhaar e-KYC', completed: true },
        { item: 'Land revenue record verified', completed: false },
        { item: 'Aadhaar NPCI bank seeding', completed: true },
      ],
    },
  ]);

  const totalAcres = farms.reduce((acc, f) => acc + f.acres, 0);
  const totalEstimatedHarvest = crops.reduce((acc, c) => acc + c.expectedYieldQuintals, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile & Farm Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-forest-900 to-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold">
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>Verified Farmer Profile</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">{user?.name || 'Ramesh Mohapatra'}</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Village: Pipili, District: Puri, State: Odisha</span>
              <span>•</span>
              <span className="font-bold text-amber-300">KCC Card Holder</span>
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 text-center">
              <p className="text-xs text-emerald-200">Total Registered Land</p>
              <p className="text-2xl font-black text-amber-300">{totalAcres} Acres</p>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 text-center">
              <p className="text-xs text-emerald-200">Est. Harvest Yield</p>
              <p className="text-2xl font-black text-emerald-300">{totalEstimatedHarvest} Qtl</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-emerald-800/80 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('crops')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'crops' ? 'bg-emerald-500 text-white shadow-md' : 'text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            🌾 Active Crops & Growth Stages
          </button>
          <button
            onClick={() => setActiveTab('farms')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'farms' ? 'bg-emerald-500 text-white shadow-md' : 'text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            📍 Registered Farm Plots ({farms.length})
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'listings' ? 'bg-emerald-500 text-white shadow-md' : 'text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            🛒 Marketplace Listings & Offers ({myListings.length})
          </button>
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'schemes' ? 'bg-emerald-500 text-white shadow-md' : 'text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            📋 Saved Schemes & Checklist ({savedSchemes.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Crops & Stages */}
      {activeTab === 'crops' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Crop Lifecycle Tracker</h2>
              <p className="text-xs text-stone-500">Monitor growth stages, fertilizer schedule, and harvest dates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Stage: {crop.stage.replace('_', ' ').toUpperCase()}
                    </span>
                    <h3 className="text-lg font-black text-stone-900 mt-2">{crop.name}</h3>
                    <p className="text-xs text-stone-500 font-medium">Variety: {crop.variety} • {crop.plotName}</p>
                  </div>
                  <span className="text-base font-black text-emerald-800">
                    Est. {crop.expectedYieldQuintals} Qtl
                  </span>
                </div>

                {/* Growth Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>Crop Development Cycle</span>
                    <span className="font-bold text-emerald-700">{crop.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-green-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${crop.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Sowing and Harvest Date Cards */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Sowing Date</span>
                    <span className="font-bold text-stone-800">{crop.sowingDate}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <span className="text-emerald-700 text-[10px] uppercase font-bold block">Expected Harvest</span>
                    <span className="font-bold text-emerald-950">{crop.harvestDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Farm Plots */}
      {activeTab === 'farms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Registered Farm Plots</h2>
              <p className="text-xs text-stone-500">Manage cadastral land boundaries and irrigation sources</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {farms.map((farm) => (
              <div
                key={farm.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-lg text-stone-900">{farm.name}</h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {farm.village}
                    </p>
                  </div>
                  <span className="text-xl font-black text-emerald-900 bg-emerald-50 px-3 py-1 rounded-2xl border border-emerald-100">
                    {farm.acres} Acres
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Soil Category</span>
                    <span className="font-bold text-stone-800">{farm.soil}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Irrigation System</span>
                    <span className="font-bold text-stone-800">{farm.irrigation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Marketplace Listings & Inquiries */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">My Marketplace Lots & Inquiries</h2>
              <p className="text-xs text-stone-500">Track purchase offers from verified traders and accept or counter</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
                      Status: {listing.status.toUpperCase()}
                    </span>
                    <h3 className="font-black text-lg text-stone-900 mt-2">{listing.crop}</h3>
                    <p className="text-xs text-stone-500">Available: {listing.quantity} {listing.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-emerald-900">₹{listing.price}</p>
                    <span className="text-[10px] text-stone-400">per {listing.unit}</span>
                  </div>
                </div>

                {/* Inquiries Alert */}
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <span>📩 <strong>Ananya Agro Traders</strong> offered ₹2,280/q for 10 quintals</span>
                  <span className="font-bold text-emerald-800 underline cursor-pointer">View Offer</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Saved Schemes & Checklist */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Document Readiness Checklist</h2>
              <p className="text-xs text-stone-500">Gather mandatory documents before submitting to the official portal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedSchemes.map((scheme, sIdx) => (
              <div
                key={sIdx}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4"
              >
                <div>
                  <h3 className="font-black text-base text-stone-900">{scheme.title}</h3>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">{scheme.benefit}</p>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-stone-700 uppercase tracking-wider">Required Checklist:</p>
                  {scheme.checklist.map((chk, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl text-xs"
                    >
                      <span className="text-stone-800">{chk.item}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          chk.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {chk.completed ? 'Ready ✓' : 'Pending Document'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
