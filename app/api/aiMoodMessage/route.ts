import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { mood, energy } = await req.json();

    const prompt = `
You're a motivational ADHD-friendly assistant that gives short, kind feedback.
Mood: ${mood}
Energy: ${energy}

Respond with a 1-sentence message using fun emojis, encouragement, and actionable tone.
Be brief, playful, and helpful. Focus on the user's mindset today.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 60,
      }),
    });

    const data = await response.json();

    const aiMessage = data.choices?.[0]?.message?.content || "You're doing great, keep going! 💛";

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('❌ AI Mood Message Error:', error);
    return NextResponse.json({ message: 'Could not generate a message. Try again soon!' }, { status: 500 });
  }
}
