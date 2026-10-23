'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Phone,
  MoreVertical,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function PhoneNumbersPage() {
  const { phoneNumbers, addPhoneNumber } = useApp();
  const [activeFilter, setActiveFilter] = useState<'All numbers' | 'Unassigned' | 'Archived' | 'Released'>('All numbers');
  const [searchNumber, setSearchNumber] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [inputNum, setInputNum] = useState('');

  const filtered = phoneNumbers.filter((p) => p.number.includes(searchNumber));

  const handleAddNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNum.trim()) return;
    addPhoneNumber(inputNum.trim());
    setInputNum('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* 4 Status Metric Cards (Matching Screenshot 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Total</span>
            <span className="text-[11px] text-slate-400">ⓘ</span>
          </div>
          <div className="text-2xl font-serif text-slate-900 font-medium">
            {phoneNumbers.length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Active</span>
            <span className="text-[11px] text-slate-400">ⓘ</span>
          </div>
          <div className="text-2xl font-serif text-slate-900 font-medium">
            {phoneNumbers.filter((p) => p.status === 'active').length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Archived</span>
            <span className="text-[11px] text-slate-400">ⓘ</span>
          </div>
          <div className="text-2xl font-serif text-slate-900 font-medium">0</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Released</span>
            <span className="text-[11px] text-slate-400">ⓘ</span>
          </div>
          <div className="text-2xl font-serif text-slate-900 font-medium">0</div>
        </div>
      </div>

      {/* Filter Pills & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 max-w-md text-xs font-medium overflow-x-auto">
          {(['All numbers', 'Unassigned', 'Archived', 'Released'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Create number group feature.')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
          >
            <Plus size={13} />
            <span>Create group</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Phone size={13} />
            <span>Connect number</span>
          </button>
        </div>
      </div>

      {/* Table & Search */}
      <div className="space-y-3 pt-2">
        {/* Search */}
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by number"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>

        {/* Table matching Screenshot 3 */}
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/60 text-slate-500 font-medium text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </th>
                  <th className="py-3 px-4 font-normal">Number</th>
                  <th className="py-3 px-4 font-normal">Group</th>
                  <th className="py-3 px-4 font-normal">Status</th>
                  <th className="py-3 px-4 font-normal">Added</th>
                  <th className="py-3 px-4 font-normal">Updated</th>
                  <th className="py-3 px-4 font-normal">Renews At</th>
                  <th className="py-3 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <input type="checkbox" className="rounded border-slate-300" />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      {item.number}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{item.group}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {item.addedDate}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {item.updatedDate}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {item.renewsAt}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 hover:text-slate-700 cursor-pointer">
                      <MoreVertical size={14} className="ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Connect number modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Connect Phone Number</h3>
            <form onSubmit={handleAddNumber} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Phone Number (E.164 format):</label>
                <input
                  type="text"
                  placeholder="+917965481286"
                  value={inputNum}
                  onChange={(e) => setInputNum(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-300 text-sm focus:outline-none focus:border-slate-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Add Number
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
