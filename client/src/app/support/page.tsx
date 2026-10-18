'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  HelpCircle,
  Camera,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface MockTicket {
  id: string;
  farmerName: string;
  district: string;
  category: string;
  priority: string;
  subject: string;
  cropName: string;
  photoUrl?: string;
  status: 'open' | 'in_progress' | 'resolved';
  assignedOfficer: string;
  messages: { sender: string; role: string; text: string; time: string }[];
}

export default function SupportPage() {
  const { user } = useAuth();

  // New Ticket State
  const [subject, setSubject] = useState('');
  const [cropName, setCropName] = useState('Paddy');
  const [category, setCategory] = useState('crop_issue');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Sample Active Tickets
  const [tickets, setTickets] = useState<MockTicket[]>([
    {
      id: 'TKT-1082',
      farmerName: 'Ramesh Mohapatra',
      district: 'Puri',
      category: 'Pest & Disease Outbreak',
      priority: 'high',
      subject: 'Yellowing of lower leaf margins and brown spots on 25-day old Paddy',
      cropName: 'Paddy (Swarna Sub-1)',
      photoUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=600&q=80',
      status: 'in_progress',
      assignedOfficer: 'Dr. Debabrata Jena (District Agricultural Office, Puri)',
      messages: [
        {
          sender: 'Ramesh Mohapatra',
          role: 'farmer',
          text: 'Observed yellow discoloration and brown spots spreading from leaf tips on 25-day old paddy plants. Need guidance on whether this is zinc deficiency or brown spot fungus.',
          time: 'Yesterday, 08:30 AM',
        },
        {
          sender: 'Dr. Debabrata Jena (DAO)',
          role: 'officer',
          text: 'The symptoms indicate early Zinc deficiency aggravated by prolonged submerged water. Drain excess standing water and spray Zinc Sulphate (0.5% + 0.25% lime) or chelated zinc @ 1g/liter during clear sunlight hours.',
          time: 'Yesterday, 11:15 AM',
        },
      ],
    },
  ]);

  const [replyText, setReplyText] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string>('TKT-1082');

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTkt: MockTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerName: user?.name || 'Ramesh Mohapatra',
      district: user?.district || 'Puri',
      category: category.replace('_', ' ').toUpperCase(),
      priority,
      subject,
      cropName,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
      status: 'open',
      assignedOfficer: 'District Agricultural Officer (Assigned to your Jurisdiction)',
      messages: [
        {
          sender: user?.name || 'Farmer',
          role: 'farmer',
          text: description,
          time: 'Just now',
        },
      ],
    };

    setTickets([newTkt, ...tickets]);
    setActiveTicketId(newTkt.id);
    setSubmitted(true);
    setSubject('');
    setDescription('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const updated = tickets.map((tkt) => {
      if (tkt.id === activeTicketId) {
        return {
          ...tkt,
          messages: [
            ...tkt.messages,
            {
              sender: user?.name || 'You',
              role: user?.role || 'farmer',
              text: replyText,
              time: 'Just now',
            },
          ],
        };
      }
      return tkt;
    });

    setTickets(updated);
    setReplyText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800 text-blue-200 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>Direct Agricultural Extension & Grievance SLA</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">Agricultural Officer Assistance</h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl">
              Report crop pest attacks, physiological disorders, or get guidance on scheme approvals from authorized District Agricultural Officers (DAOs).
            </p>
          </div>

          <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 text-xs backdrop-blur-md">
            <p className="font-bold text-white">Guaranteed Review SLA</p>
            <p className="text-blue-200 text-[11px] mt-0.5">Assigned to your district officer within 4 business hours</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Raise New Ticket Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Raise Assistance Ticket</h2>
              <p className="text-xs text-stone-500">Attach photo and describe field symptoms</p>
            </div>
          </div>

          {submitted && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ticket logged successfully! Routed to your District Officer.</span>
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Issue Subject / Symptom</label>
              <input
                type="text"
                required
                placeholder="e.g. White panicles in paddy / Rust on wheat leaves"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs font-medium p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Crop Name</label>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option value="crop_issue">Crop & Soil Issue</option>
                  <option value="pest_disease">Pest & Fungal Attack</option>
                  <option value="scheme_help">Scheme / Subsidy Help</option>
                  <option value="irrigation">Irrigation / Waterlogging</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option value="medium">Medium Priority</option>
                  <option value="high">High (Spreading Fast)</option>
                  <option value="urgent">Urgent / Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Attach Photo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="Paste image link"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Problem Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe when the symptoms started, soil moisture, and previous sprayings..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Submit Ticket to Agricultural Officer
            </button>
          </form>
        </div>

        {/* Right: Active Ticket Thread & Dialogue */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Ticket Header & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {activeTicket.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeTicket.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : activeTicket.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    STATUS: {activeTicket.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-stone-900 mt-1">{activeTicket.subject}</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Assigned Officer: <strong className="text-stone-700">{activeTicket.assignedOfficer}</strong>
                </p>
              </div>

              {activeTicket.photoUrl && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-stone-200 shrink-0">
                  <img
                    src={activeTicket.photoUrl}
                    alt="Symptom photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Conversation Messages */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {activeTicket.messages.map((msg, idx) => {
                const isOfficer = msg.role === 'officer' || msg.role === 'admin';

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                      isOfficer
                        ? 'bg-blue-50/80 border border-blue-200/80 text-blue-950 ml-4'
                        : 'bg-stone-50 border border-stone-200 text-stone-800 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {isOfficer ? '🏛️ ' : '🌾 '}
                        {msg.sender}
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal">{msg.time}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reply Input Form */}
          <form onSubmit={handleSendReply} className="pt-4 border-t border-stone-100 flex gap-2">
            <input
              type="text"
              placeholder="Type your response or followup question..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
