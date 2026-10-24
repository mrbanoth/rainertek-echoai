import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const sarvamKey = process.env.SARVAM_API_KEY;
  const sarvamNumber = process.env.SARVAM_PHONE_NUMBER || process.env.NEXT_PUBLIC_SARVAM_PHONE_NUMBER;
  const sarvamAgentId = process.env.SARVAM_AGENT_ID || process.env.NEXT_PUBLIC_SARVAM_AGENT_ID;
  const openaiKey = process.env.OPENAI_API_KEY;

  return NextResponse.json({
    sarvamConfigured: Boolean(sarvamKey && sarvamKey.trim().length > 0),
    sarvamKeyMasked: sarvamKey ? `${sarvamKey.slice(0, 4)}...${sarvamKey.slice(-4)}` : null,
    sarvamPhoneNumber: sarvamNumber || null,
    sarvamAgentId: sarvamAgentId || null,
    openaiConfigured: Boolean(openaiKey && openaiKey.trim().length > 0),
    openaiKeyMasked: openaiKey ? `${openaiKey.slice(0, 3)}...${openaiKey.slice(-4)}` : null,
  });
}
