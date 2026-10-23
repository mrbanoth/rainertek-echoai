'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  User,
  Bot,
  Play,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface TranscriptTurn {
  speaker: 'caller' | 'agent';
  text: string;
  time: string;
}

export default function LiveVoiceCallPage() {
  const {
    sarvamApiKey,
    hotlineNumber,
    selectedVoice,
    selectedLanguage,
    knowledgeContext,
    addCallLog,
  } = useApp();

  // Call status: 'idle' | 'calling' | 'connected'
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [agentThinking, setAgentThinking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([]);
  const [manualInput, setManualInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [ttsNotice, setTtsNotice] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, agentSpeaking, agentThinking]);

  // Call duration counter
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Clean format timer (mm:ss)
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Setup Web Speech API for voice recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = selectedLanguage === 'hi-IN' ? 'hi-IN' : 'en-US';

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const userSaid = event.results[current][0].transcript.trim();
          if (userSaid) {
            handleUserMessage(userSaid);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [selectedLanguage]);

  // Start call
  const startCall = async () => {
    setCallState('calling');
    setTranscript([]);

    setTimeout(async () => {
      setCallState('connected');

      // Initial greeting message
      const greeting = `Hello! Thank you for calling RainerTek. I am your EchoAI voice assistant. How may I assist you today?`;
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setTranscript([{ speaker: 'agent', text: greeting, time: now }]);
      speakReply(greeting);

      // Start listening via microphone if available
      startListening();
    }, 1200);
  };

  // End call
  const endCall = () => {
    stopListening();

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (transcript.length > 0) {
      addCallLog({
        durationSeconds: Math.max(1, callDuration),
        caller: hotlineNumber,
        turns: transcript,
        voiceModel: selectedVoice,
        language: selectedLanguage,
        status: 'completed',
      });
    }

    setCallState('idle');
    setAgentSpeaking(false);
    setAgentThinking(false);
  };

  const startListening = () => {
    if (recognitionRef.current && !isMicMuted) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        // Recognition might already be running
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {}
    }
  };

  // Toggle microphone
  const toggleMute = () => {
    if (isMicMuted) {
      setIsMicMuted(false);
      startListening();
    } else {
      setIsMicMuted(true);
      stopListening();
    }
  };

  // Speak agent's reply via Sarvam AI API or Browser Speech fallback
  const speakReply = async (text: string) => {
    setAgentSpeaking(true);

    try {
      // 1. Try Sarvam AI Text-to-Speech endpoint
      const response = await fetch('/api/sarvam/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          speaker: selectedVoice,
          language_code: selectedLanguage,
          apiKey: sarvamApiKey,
        }),
      });

      const data = await response.json();

      if (data.audioBase64) {
        // Real Sarvam AI voice audio playback!
        setTtsNotice('Synthesized using Sarvam AI Bulbul');
        const audio = new Audio(data.audioBase64);
        audioPlayerRef.current = audio;
        audio.onended = () => {
          setAgentSpeaking(false);
          startListening();
        };
        await audio.play();
        return;
      }
    } catch (e) {
      console.warn('Sarvam API call failed, using fallback:', e);
    }

    // 2. Fallback: Browser Web Speech Synthesis
    setTtsNotice('Browser voice (Add Sarvam API key in Settings for neural voice)');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'hi-IN' ? 'hi-IN' : 'en-US';
      utterance.onend = () => {
        setAgentSpeaking(false);
        startListening();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setAgentSpeaking(false);
    }
  };

  // Process user message & query knowledge context
  const handleUserMessage = async (userText: string) => {
    if (!userText.trim() || agentThinking) return;

    // Temporarily pause recognition while agent responds
    stopListening();

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = [...transcript, { speaker: 'caller' as const, text: userText, time: now }];
    setTranscript(updated);
    setManualInput('');
    setAgentThinking(true);

    try {
      const resp = await fetch('/api/sarvam/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: knowledgeContext,
          history: updated.map((t) => ({
            role: t.speaker === 'caller' ? 'user' : 'assistant',
            content: t.text,
          })),
        }),
      });

      const data = await resp.json();
      const reply = data.reply || 'Thank you for your question. I am here to help.';

      const agentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTranscript((prev) => [...prev, { speaker: 'agent', text: reply, time: agentTime }]);
      setAgentThinking(false);
      speakReply(reply);
    } catch (err) {
      setAgentThinking(false);
      const fallbackMsg = 'I apologize, could you repeat that please?';
      setTranscript((prev) => [...prev, { speaker: 'agent', text: fallbackMsg, time: now }]);
      speakReply(fallbackMsg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Hotline & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xs">
            <PhoneCall size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm md:text-base">
                Interactive Voice Hotline
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-600 font-semibold">READY</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>Hotline: <strong className="font-mono text-slate-700">{hotlineNumber}</strong></span>
              <span>•</span>
              <span>Voice: <strong className="capitalize text-slate-700">{selectedVoice}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/knowledge"
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <BookOpen size={13} className="text-indigo-600" />
            <span>Edit Knowledge Context</span>
          </Link>
          <Link
            href="/settings"
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
          >
            Configure Key
          </Link>
        </div>
      </div>

      {/* Main Interactive Call Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Call Control Center (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-xs space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base">Voice Station</h2>
              {callState === 'connected' && (
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{formatTimer(callDuration)}</span>
                </div>
              )}
            </div>

            {/* Voice Visualizer Orb / Circle */}
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                {/* Ripples when speaking or listening */}
                {callState === 'connected' && (
                  <div
                    className={`absolute w-44 h-44 rounded-full transition-all duration-300 ${
                      agentSpeaking
                        ? 'bg-indigo-500/15 animate-ping'
                        : isListening
                        ? 'bg-cyan-500/15 animate-pulse'
                        : 'bg-transparent'
                    }`}
                  />
                )}
                {callState === 'connected' && (
                  <div
                    className={`absolute w-36 h-36 rounded-full transition-all duration-300 ${
                      agentSpeaking ? 'bg-indigo-500/20' : 'bg-slate-100'
                    }`}
                  />
                )}

                {/* Center Circle Button */}
                {callState === 'idle' ? (
                  <button
                    onClick={startCall}
                    className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-105 active:scale-95 group"
                  >
                    <PhoneCall size={32} className="group-hover:rotate-12 transition-transform" />
                    <span className="text-xs font-bold mt-1 tracking-wide">START CALL</span>
                  </button>
                ) : callState === 'calling' ? (
                  <div className="w-28 h-28 rounded-full bg-amber-500 text-white flex flex-col items-center justify-center shadow-lg animate-pulse">
                    <Clock size={32} />
                    <span className="text-xs font-bold mt-1">Connecting...</span>
                  </div>
                ) : (
                  <button
                    onClick={endCall}
                    className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white flex flex-col items-center justify-center shadow-lg shadow-rose-500/25 transition-all transform hover:scale-105 active:scale-95 group"
                  >
                    <PhoneOff size={32} />
                    <span className="text-xs font-bold mt-1 tracking-wide">END CALL</span>
                  </button>
                )}
              </div>

              {/* Status Message */}
              <div className="mt-6 text-center">
                {callState === 'idle' && (
                  <p className="text-xs text-slate-500">
                    Click <strong>Start Call</strong> to speak directly with RainerTek EchoAI via your browser microphone.
                  </p>
                )}
                {callState === 'calling' && (
                  <p className="text-xs text-amber-600 font-semibold">
                    Establishing WebRTC audio session...
                  </p>
                )}
                {callState === 'connected' && (
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900">
                      {agentSpeaking
                        ? 'Agent is Speaking...'
                        : agentThinking
                        ? 'Consulting Knowledge Base...'
                        : isMicMuted
                        ? 'Microphone is Muted'
                        : 'Listening to your Voice...'}
                    </div>
                    {ttsNotice && (
                      <div className="text-[11px] text-slate-500 font-mono">{ttsNotice}</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* In-Call Controls */}
            {callState === 'connected' && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={toggleMute}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors border ${
                    isMicMuted
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {isMicMuted ? <MicOff size={16} /> : <Mic size={16} />}
                  <span>{isMicMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Context Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-indigo-600" />
                Active Knowledge Context
              </span>
              <Link href="/knowledge" className="text-indigo-600 hover:underline text-[11px]">
                Update
              </Link>
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
              {knowledgeContext}
            </p>
          </div>
        </div>

        {/* Right: Live Transcript & Interaction Stream (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 flex flex-col h-[620px] shadow-xs overflow-hidden">
          {/* Transcript Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Live Conversation Transcript</h3>
              <p className="text-xs text-slate-500">
                Turn-by-turn spoken dialogue grounded in your configured knowledge
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
              {transcript.length} turns
            </span>
          </div>

          {/* Conversation Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Bot size={40} className="text-slate-300 mb-2" />
                <p className="font-medium text-slate-600">No active conversation yet</p>
                <p className="text-xs max-w-sm mt-1">
                  Start a call above or type a test question below. EchoAI will respond using your configured knowledge context.
                </p>
              </div>
            ) : (
              transcript.map((turn, idx) => {
                const isAgent = turn.speaker === 'agent';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                      {isAgent ? (
                        <>
                          <Bot size={11} className="text-indigo-600" />
                          <span className="font-semibold text-indigo-700">RainerTek EchoAI</span>
                        </>
                      ) : (
                        <>
                          <User size={11} className="text-slate-500" />
                          <span className="font-semibold text-slate-700">You (Caller)</span>
                        </>
                      )}
                      <span>• {turn.time}</span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed text-xs shadow-xs ${
                        isAgent
                          ? 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200'
                          : 'bg-indigo-600 text-white rounded-tr-xs'
                      }`}
                    >
                      {turn.text}
                    </div>
                  </div>
                );
              })
            )}

            {agentThinking && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span>EchoAI is thinking and searching context...</span>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Sample Prompts */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/40 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">Try asking:</span>
            <button
              onClick={() => handleUserMessage('What are RainerTek working hours?')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 text-[11px] whitespace-nowrap transition-colors"
            >
              Working hours?
            </button>
            <button
              onClick={() => handleUserMessage('Who should I contact for urgent support?')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 text-[11px] whitespace-nowrap transition-colors"
            >
              Urgent support?
            </button>
            <button
              onClick={() => handleUserMessage('What services does RainerTek provide?')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 text-[11px] whitespace-nowrap transition-colors"
            >
              Company services?
            </button>
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserMessage(manualInput);
            }}
            className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your question or speak into your microphone..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none text-xs text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-xs transition-colors"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
