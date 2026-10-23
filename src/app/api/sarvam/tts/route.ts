import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, speaker = 'meera', language_code = 'en-IN', apiKey: clientKey } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 });
    }

    const apiKey = clientKey || process.env.SARVAM_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        fallback: true,
        message: 'No Sarvam API key provided. Using browser speech synthesis fallback.',
      });
    }

    // Call Sarvam AI Text-to-Speech API
    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey.trim(),
      },
      body: JSON.stringify({
        inputs: [text.slice(0, 500)], // Sarvam character limit safety
        target_language_code: language_code,
        speaker: speaker,
        pitch: 0,
        pace: 1.0,
        loudness: 1.5,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: 'bulbul:v1',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.warn('Sarvam API returned error:', errorData);
      return NextResponse.json(
        {
          fallback: true,
          error: `Sarvam API error (${response.status}): ${errorData}`,
        },
        { status: 200 } // return 200 with fallback so client can smoothly use browser audio
      );
    }

    const data = await response.json();
    const audioBase64 = data.audios?.[0];

    if (!audioBase64) {
      return NextResponse.json({ fallback: true, error: 'No audio returned from Sarvam' });
    }

    return NextResponse.json({
      success: true,
      audioBase64: `data:audio/wav;base64,${audioBase64}`,
      provider: 'sarvam',
      speaker,
    });
  } catch (err: any) {
    console.error('Sarvam TTS API route error:', err);
    return NextResponse.json({ fallback: true, error: err.message }, { status: 200 });
  }
}
