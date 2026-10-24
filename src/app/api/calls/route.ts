import { NextRequest, NextResponse } from 'next/server';
import { clearCalls, listCalls, upsertCall } from '@/lib/call-store';
import { CallSessionRecord } from '@/types';

export async function GET() {
  const calls = await listCalls();
  return NextResponse.json(calls);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CallSessionRecord;
  if (!body?.id || !Array.isArray(body.transcript)) {
    return NextResponse.json({ error: 'A call id and transcript are required.' }, { status: 400 });
  }
  const saved = await upsertCall(body);
  return NextResponse.json(saved);
}

export async function DELETE() {
  await clearCalls();
  return NextResponse.json({ ok: true });
}
