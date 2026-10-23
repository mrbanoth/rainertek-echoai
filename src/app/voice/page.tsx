'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Grid,
  Pause,
  ArrowRightLeft,
  Send,
  Radio,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  User,
  Volume2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function VoiceWorkspacePage() {
  const {
    agents,
    projects,
    selectedProject,
    selectedAgentId,
    setSelectedAgentId,
    liveCallState,
    startLiveCall,
    endLiveCall,
    toggleLiveMute,
    escalateToHuman,
    sendLiveUserMessage,
  } = useApp();

  const [activeModeTab, setActiveModeTab] = useState<'make' | 'receive'>('make');
  const [activeRightTab, setActiveRightTab] = useState<'transcript' | 'details'>('transcript');
  const [phoneNumber, setPhoneNumber] = useState('98765 43210');
  const [selectedAgentName, setSelectedAgentName] = useState('HR Assistant');
  const [selectedProjectName, setSelectedProjectName] = useState('HRMS');
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveCallState.transcript]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendLiveUserMessage(messageInput);
    setMessageInput('');
  };

  const isConnected = liveCallState.status === 'connected';

  return (
    <div className="space-y-6">
      {/* Top Title Matching Mockup 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Voice Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Make, receive and manage AI voice calls
          </p>
        </div>
      </div>

      {/* 3 Column Layout Matching Mockup 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (3.5 cols): Make a Call Configuration */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Tabs: Make a Call / Receive Calls */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 text-xs font-bold text-center">
              <button
                onClick={() => setActiveModeTab('make')}
                className={`py-2 rounded-lg transition-colors ${
                  activeModeTab === 'make'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Make a Call
              </button>
              <button
                onClick={() => setActiveModeTab('receive')}
                className={`py-2 rounded-lg transition-colors ${
                  activeModeTab === 'receive'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Receive Calls
              </button>
            </div>

            {/* Select Agent Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Select Agent
              </label>
              <select
                disabled={isConnected}
                value={selectedAgentName}
                onChange={(e) => setSelectedAgentName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="HR Assistant">HR Assistant (HRMS)</option>
                <option value="QA Bot">QA Bot (QMS)</option>
                <option value="LIMS Support">LIMS Support (Lab Science)</option>
                <option value="IT Helpdesk">IT Helpdesk (Internal)</option>
              </select>
            </div>

            {/* Select Project Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Select Project
              </label>
              <select
                disabled={isConnected}
                value={selectedProjectName}
                onChange={(e) => setSelectedProjectName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="HRMS">HRMS</option>
                <option value="QMS">QMS</option>
                <option value="LIMS">LIMS</option>
                <option value="IT">IT Infrastructure</option>
              </select>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Phone Number
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                <span className="font-bold text-slate-700 mr-2 border-r border-slate-200 pr-2">
                  +91 -
                </span>
                <input
                  type="text"
                  disabled={isConnected}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 bg-transparent text-slate-900 font-mono font-bold focus:outline-none"
                  placeholder="98765 43210"
                />
                <User size={14} className="text-slate-400" />
              </div>
            </div>
          </div>

          {/* Start Call Button */}
          <div>
            {!isConnected ? (
              <button
                onClick={() => startLiveCall(liveCallState.agentId)}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PhoneCall size={15} />
                <span>Start Call</span>
              </button>
            ) : (
              <button
                onClick={endLiveCall}
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PhoneOff size={15} />
                <span>Disconnect Active Call</span>
              </button>
            )}
          </div>
        </div>

        {/* Center Column (4.5 cols): AI Avatar & Call Controls (Matching Mockup 3) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-between min-h-[440px]">
          {/* Avatar Container with Soundwaves */}
          <div className="w-full flex-1 flex flex-col items-center justify-center relative my-2">
            {/* Pulsating Audio Soundwaves Rings */}
            <div className="relative w-44 h-44 rounded-full flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full border-2 border-blue-400/40 ${
                  isConnected ? 'animate-ping duration-1000' : ''
                }`}
              />
              <div
                className={`absolute inset-3 rounded-full border-2 border-cyan-400/50 ${
                  isConnected ? 'animate-pulse' : ''
                }`}
              />

              {/* Realistic AI Female Voice Avatar Avatar matching Mockup 3 */}
              <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-xl ring-4 ring-white border border-slate-100 bg-slate-900 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                  alt="EchoAI 3D Avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay pointer-events-none" />
              </div>
            </div>

            {/* Audio Waveform visualization line */}
            <div className="flex items-center gap-1 my-3">
              {[20, 40, 60, 30, 80, 50, 70, 40, 90, 60, 40, 20].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-cyan-400 rounded-full transition-all duration-150"
                  style={{
                    height: isConnected ? `${Math.max(4, h * (liveCallState.isMuted ? 0.2 : 0.8))}px` : '6px',
                  }}
                />
              ))}
            </div>

            {/* Status Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500'
                }`}
              />
              <span>{isConnected ? 'Call in Progress...' : 'Ready to call'}</span>
            </div>
          </div>

          {/* Action Control Bar Matching Mockup 3 */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 w-full">
            {/* Mute */}
            <button
              onClick={toggleLiveMute}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                liveCallState.isMuted
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Mute / Unmute"
            >
              {liveCallState.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            {/* Keypad */}
            <button
              onClick={() => setIsKeypadOpen(!isKeypadOpen)}
              className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
              title="Keypad"
            >
              <Grid size={16} />
            </button>

            {/* End Call Button (Big Red Circle) */}
            <button
              onClick={endLiveCall}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-500/30 transition-all cursor-pointer"
              title="End Call"
            >
              <PhoneOff size={18} />
            </button>

            {/* Hold */}
            <button
              onClick={() => setIsOnHold(!isOnHold)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isOnHold
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Hold"
            >
              <Pause size={16} />
            </button>

            {/* Transfer to Human */}
            <button
              onClick={escalateToHuman}
              className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
              title="Transfer to Human Agent"
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Live Transcript / Call Details (Matching Mockup 3) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between min-h-[440px]">
          <div>
            {/* Tabs: Live Transcript / Call Details */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold">
              <button
                onClick={() => setActiveRightTab('transcript')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeRightTab === 'transcript'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Live Transcript
              </button>
              <button
                onClick={() => setActiveRightTab('details')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeRightTab === 'details'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Call Details
              </button>
            </div>

            {/* Chat Turn Messages Scroll */}
            <div className="py-3 space-y-3 max-h-[300px] overflow-y-auto pr-1 text-xs">
              {liveCallState.transcript.map((turn, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    {turn.speaker === 'agent' ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                        E
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                        Y
                      </div>
                    )}
                    <span className="font-bold text-slate-900 text-[11px]">
                      {turn.speaker === 'agent' ? 'EchoAI' : 'You'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {turn.timestamp}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      turn.speaker === 'agent'
                        ? 'bg-blue-50/70 border border-blue-100 text-slate-800 ml-2'
                        : 'bg-slate-100 text-slate-900 ml-2'
                    }`}
                  >
                    {turn.text}
                  </div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          </div>

          {/* Bottom Chat Message Input Field */}
          <form onSubmit={handleSend} className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs disabled:opacity-40 transition-colors"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
