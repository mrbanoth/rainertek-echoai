'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Mic, PhoneOff, Square } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CallSessionRecord, CallTurn } from '@/types';

type Phase = 'idle' | 'listening' | 'thinking' | 'speaking';

function nowLabel() {
  return new Date().toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function clock() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function LiveCallPage() {
  const { agents, documents, selectedAgentId, upsertCall } = useApp();
  const agent = agents.find((item) => item.id === selectedAgentId) || agents[0];
  const docs = documents.filter((doc) => agent?.approvedKnowledgeSources?.includes(doc.title));
  const context = docs.map((doc) => `${doc.title}\n${doc.rawText || doc.contentSnippet || ''}`).join('\n\n');

  const [phase, setPhase] = useState<Phase>('idle');
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState<CallTurn[]>([]);
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');

  const phaseRef = useRef<Phase>('idle');
  const callIdRef = useRef<string | null>(null);
  const startedAtRef = useRef('');
  const startedMs = useRef(0);
  const historyRef = useRef<Array<{ speaker: 'agent' | 'caller'; text: string }>>([]);
  const transcriptRef = useRef<CallTurn[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sendingRef = useRef(false);
  const skipAudioRef = useRef(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const setPhaseBoth = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const remember = (next: CallTurn[]) => {
    transcriptRef.current = next;
    setTranscript(next);
  };

  const persist = async (next: CallTurn[], status: CallSessionRecord['status']) => {
    if (!agent || !callIdRef.current) return;
    const callerLine = [...next].reverse().find((turn) => turn.speaker === 'caller');
    const record: CallSessionRecord = {
      id: callIdRef.current,
      startTime: startedAtRef.current,
      direction: agent.channel === 'outbound' ? 'outbound' : 'inbound',
      projectId: agent.projectId || 'GENERAL',
      agentId: agent.id,
      agentName: agent.name,
      callerNumber: 'Browser mic',
      durationSeconds: Math.max(1, Math.round((Date.now() - startedMs.current) / 1000)),
      status,
      outcome: status === 'failed' ? 'failed' : 'completed',
      escalationStatus: 'none',
      estimatedCost: 0,
      intent: callerLine?.text.slice(0, 140) || 'Live browser session',
      transcript: next,
      citedKnowledgeSources: docs.map((doc) => doc.title),
      lifecycleEvents: [{ time: clock(), type: 'success', label: 'Caller speech saved', detail: callerLine?.text }],
      costBreakdown: { stt: 0, llm: 0, tts: 0, telephony: 0 },
    };
    upsertCall(record);
    await fetch('/api/calls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }).catch(() => undefined);
  };

  const playReply = async (text: string, audioBase64: string | null) => {
    setPhaseBoth('speaking');
    if (audioBase64) {
      await new Promise<void>((resolve) => {
        const audio = new Audio(audioBase64);
        audioRef.current = audio;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
      return;
    }
    await new Promise<void>((resolve) => {
      if (!window.speechSynthesis) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  };

  const sendTurn = async (audio: Blob | null, text: string) => {
    if (!agent || !callIdRef.current || sendingRef.current) return;
    if (!audio && !text.trim()) return;
    sendingRef.current = true;
    setPhaseBoth('thinking');
    setError('');

    const form = new FormData();
    if (audio && audio.size > 0) form.set('audio', audio, 'speech.webm');
    if (text.trim()) form.set('text', text.trim());
    form.set(
      'meta',
      JSON.stringify({
        callId: callIdRef.current,
        agentId: agent.id,
        agentName: agent.name,
        direction: agent.channel === 'outbound' ? 'outbound' : 'inbound',
        projectId: agent.projectId || 'GENERAL',
        task: agent.systemPrompt.instructions || agent.description,
        context,
        startedAt: startedAtRef.current,
        durationSeconds: Math.round((Date.now() - startedMs.current) / 1000),
        history: historyRef.current,
        sources: docs.map((doc) => doc.title),
      })
    );

    try {
      const response = await fetch('/api/voice/turn', { method: 'POST', body: form });
      const data = (await response.json()) as {
        heard?: boolean;
        userText?: string;
        agentText?: string;
        audioBase64?: string | null;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error || 'The voice turn failed.');
      if (!data.heard || !data.userText || !data.agentText) {
        if (phaseRef.current !== 'idle') setPhaseBoth('listening');
        setError('No speech was heard. Speak again, or type the line.');
        return;
      }

      const userTurn: CallTurn = {
        id: `turn-${historyRef.current.length}`,
        speaker: 'caller',
        text: data.userText,
        timestamp: clock(),
      };
      const agentTurn: CallTurn = {
        id: `turn-${historyRef.current.length + 1}`,
        speaker: 'agent',
        text: data.agentText,
        timestamp: clock(),
      };
      historyRef.current = [
        ...historyRef.current,
        { speaker: 'caller', text: data.userText },
        { speaker: 'agent', text: data.agentText },
      ];
      const next = [...transcriptRef.current, userTurn, agentTurn];
      remember(next);
      await persist(next, 'connected');
      await playReply(data.agentText, data.audioBase64 || null);
      if (phaseRef.current !== 'idle') setPhaseBoth('listening');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The voice turn failed.');
      if (phaseRef.current !== 'idle') setPhaseBoth('listening');
    } finally {
      sendingRef.current = false;
    }
  };

  const stopRecorder = () => {
    const recorder = recorderRef.current;
    setRecording(false);
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    else recorderRef.current = null;
  };

  const startRecorder = () => {
    const stream = streamRef.current;
    if (!stream || recorderRef.current || phaseRef.current === 'idle') return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    setRecording(true);
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
      recorderRef.current = null;
      chunksRef.current = [];
      setRecording(false);
      if (skipAudioRef.current || phaseRef.current === 'idle') {
        skipAudioRef.current = false;
        return;
      }
      void sendTurn(blob, '');
    };
    recorder.start();
    setPhaseBoth('listening');
  };

  const openMic = async () => {
    if (streamRef.current) return;
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError('Microphone permission was blocked. You can still type a line and send it.');
    }
  };

  const startCall = async () => {
    if (!agent || callIdRef.current) return;
    setError('');
    callIdRef.current = `call-${crypto.randomUUID()}`;
    startedAtRef.current = nowLabel();
    startedMs.current = Date.now();
    const greeting =
      agent.greeting ||
      (agent.channel === 'outbound'
        ? `Hello, this is ${agent.name}. Am I speaking with the right person?`
        : `Hello, this is ${agent.name}. How can I help you today?`);
    const opening: CallTurn = { id: 'turn-0', speaker: 'agent', text: greeting, timestamp: clock() };
    historyRef.current = [{ speaker: 'agent', text: greeting }];
    remember([opening]);
    await openMic();
    const spoken = await fetch('/api/voice/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: greeting }),
    })
      .then((response) => response.json())
      .catch(() => ({ audioBase64: null as string | null }));
    await playReply(greeting, spoken.audioBase64 || null);
    if (phaseRef.current === 'idle') return;
    setPhaseBoth('listening');
    startRecorder();
  };

  const endCall = async () => {
    const snapshot = transcriptRef.current;
    phaseRef.current = 'idle';
    setPhase('idle');
    skipAudioRef.current = true;
    stopRecorder();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
    if (snapshot.length > 0) await persist(snapshot, 'completed');
    callIdRef.current = null;
    setRecording(false);
  };

  const sendTyped = async (event: React.FormEvent) => {
    event.preventDefault();
    const line = typed.trim();
    if (!line || !agent) return;
    setTyped('');
    if (!callIdRef.current) {
      callIdRef.current = `call-${crypto.randomUUID()}`;
      startedAtRef.current = nowLabel();
      startedMs.current = Date.now();
      const greeting = agent.greeting || `Hello, this is ${agent.name}. How can I help you today?`;
      historyRef.current = [{ speaker: 'agent', text: greeting }];
      remember([{ id: 'turn-0', speaker: 'agent', text: greeting, timestamp: clock() }]);
    }
    skipAudioRef.current = true;
    stopRecorder();
    await sendTurn(null, line);
  };

  if (!mounted) {
    return (
      <section className="rounded-2xl bg-white border border-slate-200 p-5 min-h-[520px]">
        <h1 className="text-lg font-bold text-slate-900">Live Call</h1>
        <p className="text-xs text-slate-500 mt-1">Loading the selected agent.</p>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">
      <section className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 min-h-[520px]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-blue-600">
              {agent?.channel === 'outbound' ? 'Outbound' : 'Inbound'} · browser voice
            </p>
            <h1 className="text-lg font-bold text-slate-900">{agent?.name || 'Echo AI'}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Speak, then send. The words you say are saved in Call History. This session stays in the browser and does not dial a phone.
            </p>
          </div>
          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            {phase === 'idle' ? 'Ready' : phase === 'listening' ? 'Listening' : phase === 'thinking' ? 'Thinking' : 'Speaking'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {phase === 'idle' ? (
            <button
              type="button"
              onClick={() => void startCall()}
              disabled={!agent}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              <Mic size={14} />
              Start call
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  if (recording) stopRecorder();
                  else startRecorder();
                }}
                disabled={phase === 'thinking' || phase === 'speaking'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold disabled:opacity-50"
              >
                {recording ? <Square size={14} /> : <Mic size={14} />}
                {recording ? 'Send speech' : 'Speak'}
              </button>
              <button
                type="button"
                onClick={() => void endCall()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold"
              >
                <PhoneOff size={14} />
                End and save
              </button>
            </>
          )}
          <Link href="/calls" className="text-xs font-bold text-blue-700">
            Open call history
          </Link>
        </div>

        {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

        <div className="space-y-2">
          {transcript.length === 0 ? (
            <p className="text-xs text-slate-500">
              Start the call, speak, then press Send speech. Call History keeps the exact line you said.
            </p>
          ) : (
            transcript.map((turn) => (
              <div
                key={turn.id}
                className={`rounded-xl p-3 text-sm ${
                  turn.speaker === 'caller' ? 'bg-slate-100 text-slate-900 mr-8' : 'bg-blue-50 text-slate-800 ml-8'
                }`}
              >
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">
                  {turn.speaker === 'caller' ? 'You said' : agent?.name || 'Echo AI'}
                </p>
                <p>{turn.text}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={(event) => void sendTyped(event)} className="flex gap-2">
          <input
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            placeholder="Or type what the caller said"
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <button type="submit" className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold">
            Send
          </button>
        </form>
      </section>

      <aside className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3">
        <h2 className="text-sm font-bold text-slate-900">This call uses</h2>
        <p className="text-xs text-slate-600 whitespace-pre-wrap">{agent?.systemPrompt.instructions || 'No prompt yet.'}</p>
        <p className="text-xs font-bold text-slate-900">Context</p>
        {docs.length === 0 ? (
          <p className="text-xs text-slate-500">No notes on this agent. Add them under Agents & Knowledge.</p>
        ) : (
          docs.map((doc) => (
            <p key={doc.id} className="text-[11px] text-slate-600 line-clamp-4">
              {doc.title}: {doc.contentSnippet}
            </p>
          ))
        )}
      </aside>
    </div>
  );
}
