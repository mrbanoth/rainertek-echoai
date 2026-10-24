import { NextRequest, NextResponse } from 'next/server';
import { speakText } from '@/lib/sarvam';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { text?: string };
  const text = body.text?.trim();
  if (!text) return NextResponse.json({ error: 'Text is required.' }, { status: 400 });

  try {
    const audioBase64 = await speakText(text);
    return NextResponse.json({ audioBase64 });
  } catch {
    return NextResponse.json({ audioBase64: null });
  }
}
