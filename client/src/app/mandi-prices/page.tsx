'use client';

import React, { useState } from 'react';
import { FALLBACK_DATA } from '../../lib/api';
import { TrendingUp, ArrowUpDown, RefreshCw, MapPin, Search, BarChart3, Filter } from 'lucide-react';

export default function MandiPricesPage() {
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');

  const rawPrices = FALLBACK_DATA.mandiPrices;

  const crops = ['All', ...Array.from(new Set(rawPrices.map((p) => p.crop)))];
  const states = ['All', ...Array.from(new Set(rawPrices.map((p) => p.state)))];

  let filtered = rawPrices.filter((item) => {
    const matchesCrop = selectedCrop === 'All' || item.crop === selectedCrop;
    const matchesState = selectedState === 'All' || item.state === selectedState;
    const matchesSearch =
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesState && matchesSearch;
  });

  if (sortOrder === 'asc') {
    filtered = [...filtered].sort((a, b) => a.modalPrice - b.modalPrice);
  } else if (sortOrder === 'desc') {
    filtered = [...filtered].sort((a, b) => b.modalPrice - a.modalPrice);
  }

  // Calculate stats for selected view
  const highestModal = filtered.length > 0 ? Math.max(...filtered.map((p) => p.modalPrice)) : 0;
  const lowestModal = filtered.length > 0 ? Math.min(...filtered.map((p) => p.modalPrice)) : 0;
  const avgModal = filtered.length > 0 ? Math.round(filtered.reduce((acc, curr) => acc + curr.modalPrice, 0) / filtered.length) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span>Agmarknet & State RMC Directorate Integrated</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">Mandi Price Dashboard</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              Compare wholesale commodity prices across Mandis to maximize farm realization
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-xs flex items-center gap-3">
            <RefreshCw className="w-4 h-4 text-emerald-300 animate-spin-slow" />
            <div>
              <p className="font-bold text-white">Daily Refresh: 06:00 AM & 12:00 PM</p>
              <p className="text-emerald-200 text-[11px]">Source: Directorate of Marketing & Inspection, Govt. of India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <p className="text-xs font-medium text-stone-500">Highest Modal Price in Selection</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">₹{highestModal.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-400">per quintal</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <p className="text-xs font-medium text-stone-500">Average Rate</p>
          <p className="text-2xl font-black text-stone-800 mt-1">₹{avgModal.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-400">across {filtered.length} reporting markets</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <p className="text-xs font-medium text-stone-500">Lowest Modal Price</p>
          <p className="text-2xl font-black text-amber-700 mt-1">₹{lowestModal.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-400">per quintal</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Filter by Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            >
              {crops.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Filter by State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Sort by Price</label>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="w-full flex items-center justify-between text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 hover:bg-stone-100"
            >
              <span>{sortOrder === 'desc' ? 'High to Low' : sortOrder === 'asc' ? 'Low to High' : 'Default (Recent)'}</span>
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Search Mandi or District</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Bhubaneswar, Karnal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mandi Price Comparison Visual Bar Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <span>Market Price Comparison ({filtered.length} Mandis)</span>
          </h2>
          <span className="text-xs text-stone-500">Unit: INR (₹) / Quintal</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const barWidthPercent = highestModal > 0 ? Math.round((item.modalPrice / highestModal) * 100) : 50;

            return (
              <div
                key={item._id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base">{item.crop}</h3>
                    <p className="text-xs text-stone-500">{item.variety}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.priceTrend === 'up'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.priceTrend === 'down'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    Trend: {item.priceTrend.toUpperCase()}
                  </span>
                </div>

                {/* Price Bar Visualization */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-emerald-950">₹{item.modalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-stone-500 font-medium">Modal Rate</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-green-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  </div>
                </div>

                {/* Min / Max Range */}
                <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
                  <span>Min: ₹{item.minPrice}</span>
                  <span className="font-semibold text-emerald-700">Spread: ₹{item.maxPrice - item.minPrice}</span>
                  <span>Max: ₹{item.maxPrice}</span>
                </div>

                {/* Location and Source */}
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                  <span className="flex items-center gap-1 text-stone-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {item.market}, {item.district} ({item.state})
                  </span>
                  <span>{item.source}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
