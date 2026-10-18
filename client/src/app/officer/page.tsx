'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleGuard } from '../../components/auth/RoleGuard';
import {
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  HelpCircle,
  FileText,
  AlertTriangle,
  Building2,
  UserCheck,
} from 'lucide-react';

export default function OfficerDashboard() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([
    {
      id: 'TKT-1082',
      farmerName: 'Ramesh Mohapatra',
      district: 'Puri',
      category: 'Pest & Disease Outbreak',
      priority: 'high',
      subject: 'Yellowing of lower leaf margins in 25-day old Paddy',
      status: 'in_progress',
      reportedAt: '13 Oct 2026',
      photoUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=600&q=80',
      description: 'Observed yellow discoloration and brown spots spreading from leaf tips on 25-day old paddy plants. Need guidance on whether this is zinc deficiency or brown spot fungus.',
      officerPrescription: 'Recommended foliar spray of Zinc Sulphate (0.5%) + lime (0.25%).',
    },
    {
      id: 'TKT-1094',
      farmerName: 'Binod Bihari Sahoo',
      district: 'Puri',
      category: 'KALIA Scheme Verification',
      priority: 'medium',
      subject: 'Bank passbook IFSC update discrepancy for KALIA DBT',
      status: 'open',
      reportedAt: '14 Oct 2026',
      description: 'Merging of regional rural bank changed IFSC code, causing KALIA installment return.',
      officerPrescription: '',
    },
  ]);

  const [activeTicketId, setActiveTicketId] = useState('TKT-1082');
  const [advisoryText, setAdvisoryText] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState<'in_progress' | 'resolved'>('in_progress');

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];

  const handleUpdateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisoryText.trim()) return;

    const updated = tickets.map((t) => {
      if (t.id === activeTicketId) {
        return {
          ...t,
          status: resolutionStatus,
          officerPrescription: advisoryText,
        };
      }
      return t;
    });

    setTickets(updated);
    setAdvisoryText('');
  };

  return (
    <RoleGuard allowedRoles={['officer']} dashboardName="Agricultural Officer Advisory Desk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Desk Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800 text-blue-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>Department of Agriculture & Farmers Empowerment</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">{user?.name || 'Dr. Debabrata Jena'}</h1>
            <p className="text-xs sm:text-sm text-blue-100/90 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Assigned Jurisdiction: <strong>Puri District & Coastal Agro-Ecological Zone</strong></span>
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 text-center">
              <p className="text-xs text-blue-200">District Tickets</p>
              <p className="text-2xl font-black text-amber-300">{tickets.length}</p>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 text-center">
              <p className="text-xs text-blue-200">Resolved Cases</p>
              <p className="text-2xl font-black text-emerald-300">18</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: District Assistance Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">District Assistance Queue</h2>
            <span className="text-xs text-stone-500">{tickets.length} Assigned</span>
          </div>

          <div className="space-y-3">
            {tickets.map((tkt) => (
              <div
                key={tkt.id}
                onClick={() => setActiveTicketId(tkt.id)}
                className={`p-5 rounded-3xl border transition cursor-pointer space-y-2 ${
                  activeTicketId === tkt.id
                    ? 'bg-blue-50/70 border-blue-400 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                    {tkt.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      tkt.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : tkt.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tkt.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-stone-900 line-clamp-1">{tkt.subject}</h3>
                <p className="text-xs text-stone-500">Farmer: <strong>{tkt.farmerName}</strong> • {tkt.district}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Diagnosis & Official Guidance Composer */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-stone-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                Reviewing {activeTicket.id}
              </span>
              <h3 className="text-lg font-black text-stone-900 mt-1">{activeTicket.subject}</h3>
              <p className="text-xs text-stone-500">Cultivator: {activeTicket.farmerName} • Reported on {activeTicket.reportedAt}</p>
            </div>

            {activeTicket.photoUrl && (
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-stone-200 shrink-0">
                <img
                  src={activeTicket.photoUrl}
                  alt="Crop symptoms"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-800 space-y-1">
            <span className="text-stone-400 font-bold uppercase text-[10px]">Farmer's Field Report:</span>
            <p className="leading-relaxed">{activeTicket.description}</p>
          </div>

          {activeTicket.officerPrescription && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <span className="text-emerald-700 font-bold uppercase text-[10px]">Previous Advisory Sent:</span>
              <p className="font-medium">{activeTicket.officerPrescription}</p>
            </div>
          )}

          {/* Form to submit official advisory & change status */}
          <form onSubmit={handleUpdateTicket} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Official Agricultural Advisory & Prescription
              </label>
              <textarea
                required
                rows={4}
                placeholder="Prescribe agronomic solution, recommended chemical/organic dose, or scheme rectification..."
                value={advisoryText}
                onChange={(e) => setAdvisoryText(e.target.value)}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-stone-700">Set Ticket Status:</label>
                <select
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value as any)}
                  className="text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5"
                >
                  <option value="in_progress">In Progress (Further Inspection)</option>
                  <option value="resolved">Resolved (Guidance Provided)</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Official Guidance</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </RoleGuard>
  );
}
