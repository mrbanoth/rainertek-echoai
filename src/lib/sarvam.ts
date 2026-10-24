const CHAT_URL = 'https://api.sarvam.ai/v1/chat/completions';
const STT_URL = 'https://api.sarvam.ai/speech-to-text';
const TTS_URL = 'https://api.sarvam.ai/text-to-speech';

function apiKey() {
  const key = process.env.SARVAM_API_KEY?.trim();
  if (!key) throw new Error('SARVAM_API_KEY is missing');
  return key;
}

export function answerFromContext(question: string, context: string) {
  const words = question
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3);
  const sentences = context
    .split(/(?<=[.?\n])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  let best = '';
  let score = 0;
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const hit = words.filter((word) => lower.includes(word)).length;
    if (hit > score) {
      score = hit;
      best = sentence;
    }
  }

  if (score === 0 || !best) return 'I cannot verify that.';
  return best.slice(0, 420);
}

export async function transcribeAudio(bytes: Uint8Array, mime: string) {
  const form = new FormData();
  form.set('model', 'saaras:v4');
  form.set('mode', 'transcribe');
  const kind = mime.includes('wav') ? 'wav' : mime.includes('mpeg') ? 'mp3' : 'webm';
  form.set('file', new Blob([bytes], { type: mime || 'audio/webm' }), `speech.${kind}`);

  const response = await fetch(STT_URL, {
    method: 'POST',
    headers: { 'api-subscription-key': apiKey() },
    body: form,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Speech recognition failed (${response.status}): ${detail.slice(0, 180)}`);
  }

  const data = (await response.json()) as {
    transcript?: string;
    language_code?: string | null;
  };

  return {
    transcript: (data.transcript || '').trim(),
    languageCode: data.language_code || null,
  };
}

export async function replyAsAgent(input: {
  name: string;
  task: string;
  context: string;
  history: Array<{ speaker: 'agent' | 'caller'; text: string }>;
  question: string;
}) {
  const context = input.context.slice(0, 12000);
  const system = [
    `You are ${input.name}, a voice agent for Echo AI.`,
    'Speak one or two short sentences. This is a live call.',
    `Task: ${input.task}`,
    'Answer only from the context below. If the answer is not in the context, say exactly: I cannot verify that.',
    `Context:\n${context || 'No context was saved for this agent.'}`,
  ].join('\n');

  const messages = [
    { role: 'system', content: system },
    ...input.history.slice(-8).map((turn) => ({
      role: turn.speaker === 'caller' ? 'user' : 'assistant',
      content: turn.text,
    })),
    { role: 'user', content: input.question },
  ];

  try {
    const response = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey(),
      },
      body: JSON.stringify({
        model: 'sarvam-105b-conversations',
        messages,
        temperature: 0.2,
        max_tokens: 280,
        reasoning_effort: null,
        stream: false,
      }),
    });

    if (!response.ok) {
      return answerFromContext(input.question, context);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return answerFromContext(input.question, context);
    return content.slice(0, 500);
  } catch {
    return answerFromContext(input.question, context);
  }
}

export async function speakText(text: string, _languageCode = 'en-IN') {
  const response = await fetch(TTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': apiKey(),
    },
    body: JSON.stringify({
      text: text.slice(0, 500),
      model: 'bulbul:v4-flash',
      language_code: 'en-IN',
      speaker: 'shubh_enhi_ads',
    }),
  });

  if (!response.ok) return null;
  const data = (await response.json()) as { audios?: string[]; audio?: string };
  const audio = data.audios?.[0] || data.audio;
  if (!audio) return null;
  return `data:audio/wav;base64,${audio}`;
}
