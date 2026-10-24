import { NextRequest, NextResponse } from 'next/server';
import { upsertCall } from '@/lib/call-store';
import { replyAsAgent, speakText, transcribeAudio } from '@/lib/sarvam';
import { CallSessionRecord, CallTurn } from '@/types';

type TurnMeta = {
  callId: string;
  agentId: string;
  agentName: string;
  direction: 'inbound' | 'outbound';
  projectId: string;
  task: string;
  context: string;
  startedAt: string;
  durationSeconds: number;
  history: Array<{ speaker: 'agent' | 'caller'; text: string }>;
  sources: string[];
};

function stamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const meta = JSON.parse(String(form.get('meta') || '{}')) as TurnMeta;
    const typed = String(form.get('text') || '').trim();
    const audio = form.get('audio');
    const upload = audio instanceof Blob ? audio : null;

    if (!meta.callId || !meta.agentName) {
      return NextResponse.json({ error: 'Choose an agent before speaking.' }, { status: 400 });
    }

    let userText = typed;
    let languageCode: string | null = null;

    if (upload && upload.size > 800) {
      const bytes = new Uint8Array(await upload.arrayBuffer());
      const heard = await transcribeAudio(bytes, upload.type || 'audio/webm');
      languageCode = heard.languageCode;
      if (heard.transcript) userText = heard.transcript;
    }

    if (!userText) {
      return NextResponse.json({ heard: false, userText: '' });
    }

    const agentText = await replyAsAgent({
      name: meta.agentName,
      task: meta.task || 'Answer from the saved context.',
      context: meta.context || '',
      history: Array.isArray(meta.history) ? meta.history : [],
      question: userText,
    });

    const audioBase64 = await speakText(agentText, languageCode || 'en-IN').catch(() => null);
    const time = stamp();
    const prior: CallTurn[] = (meta.history || []).map((turn, index) => ({
      id: `turn-${index}`,
      speaker: turn.speaker,
      text: turn.text,
      timestamp: meta.startedAt,
    }));
    const transcript: CallTurn[] = [
      ...prior,
      { id: `turn-${prior.length}`, speaker: 'caller', text: userText, timestamp: time },
      { id: `turn-${prior.length + 1}`, speaker: 'agent', text: agentText, timestamp: time },
    ];

    const call: CallSessionRecord = {
      id: meta.callId,
      startTime: meta.startedAt,
      direction: meta.direction === 'outbound' ? 'outbound' : 'inbound',
      projectId: meta.projectId || 'GENERAL',
      agentId: meta.agentId,
      agentName: meta.agentName,
      callerNumber: 'Browser mic',
      durationSeconds: Math.max(0, Math.round(meta.durationSeconds || 0)),
      status: 'connected',
      outcome: 'completed',
      escalationStatus: 'none',
      estimatedCost: 0,
      intent: userText.slice(0, 140),
      transcript,
      citedKnowledgeSources: meta.sources || [],
      lifecycleEvents: [
        { time, type: 'success', label: 'Caller speech saved', detail: userText.slice(0, 180) },
      ],
      costBreakdown: { stt: 0, llm: 0, tts: 0, telephony: 0 },
    };

    await upsertCall(call);

    return NextResponse.json({
      heard: true,
      userText,
      agentText,
      audioBase64,
      call,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Voice turn failed';
    return NextResponse.json({ error: message.slice(0, 240) }, { status: 500 });
  }
}
