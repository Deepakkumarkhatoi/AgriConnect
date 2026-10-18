'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleGuard } from '../../components/auth/RoleGuard';
import {
  ShieldAlert,
  Users,
  Store,
  FileText,
  Activity,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Key,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'schemes' | 'audit'>('users');

  // Registered Accounts for verification & moderation
  const [userList, setUserList] = useState([
    { id: 'usr-1', name: 'Ramesh Mohapatra', role: 'farmer', status: 'active', district: 'Puri', email: 'farmer@agriconnect.com' },
    { id: 'usr-2', name: 'Ananya Agro Traders', role: 'buyer', status: 'pending_verification', district: 'Bhubaneswar', email: 'buyer@agriconnect.com' },
    { id: 'usr-3', name: 'Dr. Debabrata Jena', role: 'officer', status: 'active', district: 'Puri', email: 'officer@agriconnect.com' },
    { id: 'usr-4', name: 'Kalinga Seeds & Fertilizers', role: 'buyer', status: 'active', district: 'Cuttack', email: 'kalinga@seeds.in' },
  ]);

  // System Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    { id: 'log-1', action: 'USER_REGISTERED', actor: 'Ananya Agro Traders', role: 'buyer', time: '14 Oct 2026, 11:30 AM' },
    { id: 'log-2', action: 'LISTING_PUBLISHED', actor: 'Ramesh Mohapatra', role: 'farmer', time: '14 Oct 2026, 10:15 AM' },
    { id: 'log-3', action: 'OFFICER_REPLIED', actor: 'Dr. Debabrata Jena', role: 'officer', time: '13 Oct 2026, 02:45 PM' },
    { id: 'log-4', action: 'ORDER_ACCEPTED', actor: 'Ramesh Mohapatra', role: 'farmer', time: '13 Oct 2026, 09:20 AM' },
  ]);

  const handleToggleUserStatus = (userId: string) => {
    setUserList(
      userList.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: u.status === 'active' ? 'pending_verification' : 'active',
          };
        }
        return u;
      })
    );
  };

  return (
    <RoleGuard allowedRoles={['admin']} dashboardName="Platform Administration Hub">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Operations Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800 text-purple-200 text-xs font-semibold">
              <Key className="w-4 h-4 text-purple-300" />
              <span>Platform Security & Operations Command</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">Platform Administration Hub</h1>
            <p className="text-xs sm:text-sm text-purple-100/90 max-w-2xl">
              Manage multi-role permissions, verify wholesale trading licenses, audit platform transactions, and publish official welfare schemes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
              <p className="text-xs text-purple-200">Total Users</p>
              <p className="text-2xl font-black text-amber-300">{userList.length}</p>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
              <p className="text-xs text-purple-200">Pending Verify</p>
              <p className="text-2xl font-black text-rose-300">
                {userList.filter((u) => u.status === 'pending_verification').length}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-purple-800/80 text-xs font-bold">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'users' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-200 hover:bg-purple-900'
            }`}
          >
            👥 User & Entity Verification ({userList.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'audit' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-200 hover:bg-purple-900'
            }`}
          >
            🛡️ Platform Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Tab 1: User Verification */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-stone-900">User Accounts Directory</h2>
              <p className="text-xs text-stone-500">Inspect buyer GSTIN/APMC licenses and officer credentials</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Account Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {userList.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/60">
                    <td className="p-3 font-bold text-stone-900">{u.name}</td>
                    <td className="p-3">
                      <span className="capitalize font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-stone-600">{u.district}</td>
                    <td className="p-3 text-stone-500">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                          u.status === 'active'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {u.status === 'active' ? 'Revoke Status' : 'Verify & Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: System Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Immutable Audit Trail</h2>
              <p className="text-xs text-stone-500">Track operations, listings, status transitions, and user actions</p>
            </div>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-900">{log.action}</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                      {log.role.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-stone-500">Initiated by: <strong>{log.actor}</strong></p>
                </div>
                <span className="text-stone-400 text-[11px] font-medium">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </RoleGuard>
  );
}
