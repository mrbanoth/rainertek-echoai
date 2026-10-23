import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, context = '', history = [], apiKey: clientKey } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const cleanMsg = message.trim().toLowerCase();

    // Standard conversational greetings
    if (['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'namaste'].some((g) => cleanMsg === g || cleanMsg.startsWith(g + ' '))) {
      return NextResponse.json({
        reply: `Hello! I am your RainerTek EchoAI voice assistant. How can I help you today? You can ask me anything about our company guidelines, services, or procedures.`,
        sources: ['Default Greeting'],
      });
    }

    // Check if user provided OpenAI API key in env
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const aiResp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are RainerTek EchoAI, a helpful, clear, and professional internal voice assistant.
Answer the user's question concisely in 2-3 spoken sentences based on the following Knowledge Context.
If the answer cannot be found in the context, politely state that the information is not in the approved knowledge base and offer to transfer or take a note.
Knowledge Context:
${context}`,
              },
              ...history.slice(-4),
              { role: 'user', content: message },
            ],
            temperature: 0.3,
            max_tokens: 150,
          }),
        });

        if (aiResp.ok) {
          const aiData = await aiResp.json();
          const reply = aiData.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply, sources: ['Knowledge Context via AI'] });
          }
        }
      } catch (e) {
        console.warn('OpenAI query failed, falling back to local context matcher:', e);
      }
    }

    // Context-Aware Grounded Matcher:
    // Extract paragraphs/lines from context
    const lines = context
      .split('\n')
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 15);

    const keywords = cleanMsg
      .replace(/[?.,!]/g, '')
      .split(' ')
      .filter((w: string) => w.length > 3 && !['what', 'when', 'where', 'which', 'could', 'would', 'should', 'about', 'there', 'their'].includes(w));

    let bestMatch = '';
    let maxMatches = 0;

    for (const line of lines) {
      const lower = line.toLowerCase();
      let matchCount = 0;
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          matchCount++;
        }
      }
      if (matchCount > maxMatches) {
        maxMatches = matchCount;
        bestMatch = line;
      }
    }

    if (maxMatches > 0 && bestMatch) {
      return NextResponse.json({
        reply: `According to our records: ${bestMatch}`,
        sources: ['Active Knowledge Context'],
      });
    }

    // If context has content but specific match wasn't direct
    if (context && context.trim().length > 30) {
      const firstChunk = lines[0] || context.slice(0, 200);
      return NextResponse.json({
        reply: `Based on your configured context: ${firstChunk}. Would you like more details on this topic?`,
        sources: ['Active Knowledge Context'],
      });
    }

    // Graceful helpful fallback
    return NextResponse.json({
      reply: `Thank you for asking. I am currently listening, but I do not see any specific information regarding "${message}" in your Knowledge Context yet. You can paste relevant notes in the Knowledge tab to teach me!`,
      sources: ['Knowledge Base'],
    });
  } catch (err: any) {
    console.error('Chat API error:', err);
    return NextResponse.json({
      reply: 'I experienced a brief connection glitch. Please try speaking again.',
      error: err.message,
    });
  }
}
