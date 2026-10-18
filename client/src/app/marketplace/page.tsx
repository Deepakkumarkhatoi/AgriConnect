'use client';

import React, { useState } from 'react';
import { FALLBACK_DATA } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  Store,
  MapPin,
  Calendar,
  Send,
  X,
  CheckCircle2,
  Filter,
  Search,
  DollarSign,
  Package,
  Phone,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export default function MarketplacePage() {
  const { user } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null);

  // Inquiry Form State
  const [offerQuantity, setOfferQuantity] = useState<number>(10);
  const [offerPrice, setOfferPrice] = useState<number>(2300);
  const [deliveryNote, setDeliveryNote] = useState<string>('Farm gate collection preferred');
  const [submittedOrder, setSubmittedOrder] = useState<boolean>(false);

  const rawListings = FALLBACK_DATA.listings;

  const crops = ['All', ...Array.from(new Set(rawListings.map((l) => l.crop)))];
  const districts = ['All', ...Array.from(new Set(rawListings.map((l) => l.district)))];

  const filteredListings = rawListings.filter((item) => {
    const matchesCrop = selectedCrop === 'All' || item.crop === selectedCrop;
    const matchesDistrict = selectedDistrict === 'All' || item.district === selectedDistrict;
    const matchesSearch =
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesDistrict && matchesSearch;
  });

  const handleOpenOfferModal = (item: any) => {
    setActiveModalItem(item);
    setOfferQuantity(Math.min(10, item.quantityAvailable));
    setOfferPrice(item.pricePerUnit);
    setSubmittedOrder(false);
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedOrder(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-semibold backdrop-blur-md">
              <Store className="w-4 h-4 text-emerald-300" />
              <span>Direct Farm-to-Buyer Trading Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">Direct Produce Marketplace</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              Source verified farm produce directly from cultivators. Submit purchase inquiries, negotiate terms transparently, and track order fulfillment.
            </p>
          </div>

          <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 text-xs backdrop-blur-md">
            <p className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Middlemen Commission</span>
            </p>
            <p className="text-emerald-200 text-[11px] mt-0.5">Direct seller contact & transparent negotiation</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Filter by Commodity</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2"
            >
              {crops.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Filter by District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Search Produce or Producer</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Swarna, Pusa, Ramesh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">
            Available Produce Lots ({filteredListings.length})
          </h2>
          <span className="text-xs text-stone-500">Sorted by most recently listed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:border-emerald-400 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-stone-100">
                  <img
                    src={item.images[0]}
                    alt={item.crop}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-emerald-900 shadow-xs">
                    {item.qualityGrade}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                    {item.quantityAvailable} {item.unit} in stock
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base">{item.crop}</h3>
                    <p className="text-xs text-stone-500 font-medium">{item.variety}</p>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item.village}, {item.district} ({item.state})</span>
                  </div>

                  <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex items-baseline justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-emerald-800">Offered Rate</p>
                      <p className="text-lg font-black text-emerald-950">₹{item.pricePerUnit} <span className="text-xs font-normal text-stone-500">/{item.unit}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-stone-400">Total Lot</p>
                      <p className="text-xs font-bold text-stone-700">₹{(item.quantityAvailable * item.pricePerUnit).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleOpenOfferModal(item)}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Purchase Offer / Negotiate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Negotiation / Purchase Request Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in zoom-in-95">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {!submittedOrder ? (
              <form onSubmit={handleSendOffer} className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Direct Purchase Inquiry
                  </span>
                  <h3 className="text-xl font-black text-stone-900 mt-2">
                    Negotiate for {activeModalItem.crop}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Producer: <strong>{activeModalItem.farmerName}</strong> ({activeModalItem.district}, {activeModalItem.state})
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Required Quantity ({activeModalItem.unit})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={activeModalItem.quantityAvailable}
                      value={offerQuantity}
                      onChange={(e) => setOfferQuantity(Number(e.target.value))}
                      required
                      className="w-full text-xs font-bold p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                    <span className="text-[10px] text-stone-400">Max available: {activeModalItem.quantityAvailable}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Your Proposed Rate (₹/{activeModalItem.unit})
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      required
                      className="w-full text-xs font-bold p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                    <span className="text-[10px] text-stone-400">Asking rate: ₹{activeModalItem.pricePerUnit}</span>
                  </div>
                </div>

                {/* Estimated Calculation */}
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-stone-500">Proposed Total Value:</p>
                    <p className="text-xl font-black text-emerald-900">
                      ₹{(offerQuantity * offerPrice).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-600 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                    {offerQuantity} {activeModalItem.unit} @ ₹{offerPrice}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Logistics / Delivery Preference Note
                  </label>
                  <input
                    type="text"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="e.g. Farm gate collection / Need moisture test on delivery"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModalItem(null)}
                    className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition"
                  >
                    Submit Purchase Request
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-stone-900">Purchase Request Dispatched!</h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Your inquiry for <strong>{offerQuantity} {activeModalItem.unit}</strong> of {activeModalItem.crop} at <strong>₹{offerPrice}/{activeModalItem.unit}</strong> has been transmitted directly to farmer <strong>{activeModalItem.farmerName}</strong>.
                </p>
                <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600">
                  Status: <strong>Order Status: INQUIRY (Awaiting Farmer Acceptance or Counter)</strong>
                </div>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-6 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 transition"
                >
                  Return to Marketplace
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
