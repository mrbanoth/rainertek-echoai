'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Play,
  Pause,
  Download,
  Volume2,
  X,
  FileText,
  DollarSign,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CallSessionRecord } from '@/types';

export default function CallHistoryPage() {
  const { calls, projects, agents, selectedProject, setSelectedProject } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [activeCallDetail, setActiveCallDetail] = useState<CallSessionRecord | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Exact sample calls matching Mockup 5
  const sampleHistoryCalls = [
    {
      id: '1',
      dateTime: 'Oct 23, 10:34 AM',
      direction: 'Inbound',
      callerNumber: '+91 98765 43210',
      project: 'HRMS',
      agent: 'HR Assistant',
      status: 'Completed',
      duration: '02:34',
      cost: '₹12.50',
    },
    {
      id: '2',
      dateTime: 'Oct 23, 10:21 AM',
      direction: 'Outbound',
      callerNumber: '+91 91234 56789',
      project: 'QMS',
      agent: 'Quality Bot',
      status: 'Completed',
      duration: '01:12',
      cost: '₹6.30',
    },
    {
      id: '3',
      dateTime: 'Oct 23, 10:18 AM',
      direction: 'Inbound',
      callerNumber: '+91 99987 76655',
      project: 'LIMS',
      agent: 'LIMS Support',
      status: 'Missed',
      duration: '00:00',
      cost: '₹0.00',
    },
    {
      id: '4',
      dateTime: 'Oct 23, 09:56 AM',
      direction: 'Inbound',
      callerNumber: '+91 98123 45678',
      project: 'HRMS',
      agent: 'HR Assistant',
      status: 'Completed',
      duration: '03:16',
      cost: '₹15.40',
    },
    {
      id: '5',
      dateTime: 'Oct 22, 04:12 PM',
      direction: 'Outbound',
      callerNumber: '+91 81456 32109',
      project: 'QMS',
      agent: 'Quality Bot',
      status: 'Failed',
      duration: '00:00',
      cost: '₹0.00',
    },
    {
      id: '6',
      dateTime: 'Oct 22, 11:30 AM',
      direction: 'Outbound',
      callerNumber: '+91 70123 98765',
      project: 'IT',
      agent: 'IT Helpdesk',
      status: 'Completed',
      duration: '04:22',
      cost: '₹18.60',
    },
  ];

  const handleExport = () => {
    const csv = 'data:text/csv;charset=utf-8,ID,Date,Direction,Number,Project,Agent,Status,Duration,Cost\n' +
      sampleHistoryCalls.map(c => `${c.id},${c.dateTime},${c.direction},${c.callerNumber},${c.project},${c.agent},${c.status},${c.duration},${c.cost}`).join('\n');
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', 'RainerTek_Call_History.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Matching Mockup 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Call History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View and search all inbound and outbound calls
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Download size={14} />
          <span>+ Export</span>
        </button>
      </div>

      {/* Filter Bar Matching Mockup 5 */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by number, caller name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
          />
        </div>

        {/* Date Dropdown */}
        <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
          Oct 1, 2026 - Oct 23, 2026
        </div>

        {/* All Projects */}
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none shadow-xs"
        >
          <option value="ALL">All Projects</option>
          <option value="HRMS">HRMS</option>
          <option value="QMS">QMS</option>
          <option value="LIMS">LIMS</option>
          <option value="IT">IT Infrastructure</option>
        </select>

        {/* All Agents */}
        <select
          value={selectedAgentFilter}
          onChange={(e) => setSelectedAgentFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none shadow-xs"
        >
          <option value="ALL">All Agents</option>
          <option value="HR Assistant">HR Assistant</option>
          <option value="Quality Bot">Quality Bot</option>
          <option value="LIMS Support">LIMS Support</option>
          <option value="IT Helpdesk">IT Helpdesk</option>
        </select>

        {/* All Status */}
        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none shadow-xs"
        >
          <option value="ALL">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Missed">Missed</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Call History Table Matching Mockup 5 */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Caller / Number</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Agent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sampleHistoryCalls.map((call) => (
                <tr key={call.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-400">{call.id}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{call.dateTime}</td>
                  <td className="py-3 px-4">
                    {call.direction === 'Inbound' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold">
                        Inbound
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 text-[10px] font-bold">
                        Outbound
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{call.callerNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-700">{call.project}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{call.agent}</td>
                  <td className="py-3 px-4">
                    {call.status === 'Completed' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                        ● Completed
                      </span>
                    ) : call.status === 'Missed' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold">
                        ● Missed
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold">
                        ● Failed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{call.duration}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{call.cost}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <button
                        onClick={() => alert(`Playing recorded audio for call #${call.id}`)}
                        className="p-1 rounded hover:text-blue-600 hover:bg-blue-50"
                        title="Listen to Call Recording"
                      >
                        <Volume2 size={14} />
                      </button>
                      <button
                        onClick={() => alert(`Inspecting turn transcript for ${call.callerNumber}`)}
                        className="p-1 rounded hover:text-blue-600 hover:bg-blue-50"
                        title="View Full Transcript"
                      >
                        <FileText size={14} />
                      </button>
                      <button className="p-1 rounded hover:text-slate-800">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination Matching Mockup 5 */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Showing 1 to 6 of 240 results</span>

          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center">
              2
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center">
              3
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center">
              4
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center">
              5
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center">
              42
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
