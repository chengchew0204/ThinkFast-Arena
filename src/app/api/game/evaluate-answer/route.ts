import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { question, answer, topicName } = await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Missing required parameters: question and answer' },
        { status: 400 }
      );
    }

    // No longer generating follow-up questions - return empty array
    return NextResponse.json({ 
      analysis: 'Answer received and will be scored.',
      followUpQuestions: [] 
    });
  } catch (error) {
    console.error('Answer evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate answer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

