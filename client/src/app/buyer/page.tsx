'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Store,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  DollarSign,
  Package,
  ShieldCheck,
  Send,
  Building2,
} from 'lucide-react';

export default function BuyerDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'negotiation'>('orders');

  const [orders, setOrders] = useState([
    {
      id: 'ORD-7741',
      farmerName: 'Ramesh Mohapatra',
      farmerLocation: 'Pipili, Puri (Odisha)',
      crop: 'Paddy (Swarna Sub-1)',
      quantity: 10,
      unit: 'Quintal',
      initialOfferPrice: 2280,
      counterPrice: 2320,
      totalAmount: 23200,
      status: 'negotiating',
      date: '12 Oct 2026',
      messages: [
        { sender: 'Ananya Agro Traders', role: 'buyer', text: 'Hello Ramesh ji, we can procure 10 quintals of Swarna Sub-1. Can you supply at ₹2,280/q?', time: '10:00 AM' },
        { sender: 'Ramesh Mohapatra (Farmer)', role: 'farmer', text: 'Namaste! Grain moisture is strictly maintained below 13.5%. Counter-offer is ₹2,320/q including bags.', time: '02:30 PM' },
      ],
    },
    {
      id: 'ORD-6512',
      farmerName: 'Suresh Chandra Pradhan',
      farmerLocation: 'Ranpur, Nayagarh (Odisha)',
      crop: 'Moong Dal (Bold Machine Cleaned)',
      quantity: 15,
      unit: 'Quintal',
      initialOfferPrice: 8300,
      counterPrice: 8300,
      totalAmount: 124500,
      status: 'accepted',
      date: '10 Oct 2026',
      messages: [
        { sender: 'Ananya Agro Traders', role: 'buyer', text: 'Confirmed offer for 15 quintals of Moong Dal at ₹8,300/q.', time: '09:00 AM' },
        { sender: 'Suresh Chandra Pradhan', role: 'farmer', text: 'Offer accepted! Stock has been reserved for pickup.', time: '11:00 AM' },
      ],
    },
  ]);

  const [counterInput, setCounterInput] = useState<string>('2300');
  const [chatMessage, setChatMessage] = useState<string>('');

  const activeOrder = orders[0];

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() && !counterInput) return;

    const newMsg = {
      sender: user?.organization || user?.name || 'Buyer',
      role: 'buyer',
      text: chatMessage || `Proposed counter rate: ₹${counterInput}/q`,
      time: 'Just now',
    };

    const updated = orders.map((o) => {
      if (o.id === activeOrder.id) {
        return {
          ...o,
          counterPrice: Number(counterInput) || o.counterPrice,
          messages: [...o.messages, newMsg],
        };
      }
      return o;
    });

    setOrders(updated);
    setChatMessage('');
  };

  const handleAcceptCounter = (orderId: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'accepted',
          messages: [
            ...o.messages,
            {
              sender: user?.name || 'Buyer',
              role: 'buyer',
              text: `Accepted farmer's rate of ₹${o.counterPrice}/${o.unit}. Order confirmed!`,
              time: 'Just now',
            },
          ],
        };
      }
      return o;
    });
    setOrders(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Buyer Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-800 text-amber-200 text-xs font-semibold">
              <Building2 className="w-4 h-4 text-amber-300" />
              <span>Verified Wholesale Buyer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">{user?.organization || 'Ananya Agro Traders'}</h1>
            <p className="text-xs sm:text-sm text-amber-100/90 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Registered HQ: Bhubaneswar, Odisha</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Verified Buyer Badge</span>
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 text-center">
              <p className="text-xs text-amber-200">Active Purchase Orders</p>
              <p className="text-2xl font-black text-amber-300">{orders.length}</p>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 text-center">
              <p className="text-xs text-amber-200">Committed Value</p>
              <p className="text-2xl font-black text-emerald-300">₹1,47,700</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List & Active Negotiation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Purchase Orders Directory */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">Purchase Orders & Inquiries</h2>
            <span className="text-xs text-stone-500">{orders.length} Records</span>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:border-amber-400 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                      {order.id}
                    </span>
                    <h3 className="font-extrabold text-stone-900 text-base mt-1.5">{order.crop}</h3>
                    <p className="text-xs text-stone-500">Producer: {order.farmerName}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      order.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'negotiating'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Procured Quantity</span>
                    <span className="font-bold text-stone-800">{order.quantity} {order.unit}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Counter Rate</span>
                    <span className="font-black text-emerald-800">₹{order.counterPrice}/{order.unit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                  <span className="text-stone-500">Total: <strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong></span>
                  {order.status === 'negotiating' && (
                    <button
                      onClick={() => handleAcceptCounter(order.id)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition"
                    >
                      Accept ₹{order.counterPrice}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Negotiation Thread with Farmer */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  Live Negotiation Thread ({activeOrder.id})
                </span>
                <h3 className="font-extrabold text-lg text-stone-900 mt-1">
                  Trading with {activeOrder.farmerName}
                </h3>
                <p className="text-xs text-stone-500">{activeOrder.crop} • {activeOrder.quantity} {activeOrder.unit}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-400 block font-medium">Asking Rate</span>
                <span className="text-xl font-black text-amber-700">₹{activeOrder.counterPrice}/{activeOrder.unit}</span>
              </div>
            </div>

            {/* Negotiation Messages */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {activeOrder.messages.map((msg, idx) => {
                const isMe = msg.role === 'buyer';

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                      isMe
                        ? 'bg-amber-50 border border-amber-200/80 text-amber-950 ml-4'
                        : 'bg-stone-50 border border-stone-200 text-stone-800 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{isMe ? '🏢 ' : '🌾 '}{msg.sender}</span>
                      <span className="text-[10px] text-stone-400 font-normal">{msg.time}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Counter Rate Proposal Input */}
          <form onSubmit={handleSendCounter} className="pt-4 border-t border-stone-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-40">
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Counter Rate (₹/q)</label>
                <input
                  type="number"
                  value={counterInput}
                  onChange={(e) => setCounterInput(e.target.value)}
                  className="w-full text-xs font-bold p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Message to Farmer</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Can do ₹2,300 with immediate RTGS payment on loading..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
