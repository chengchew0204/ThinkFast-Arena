import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { question, answer, topicName } = await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Missing required parameters: question and answer' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `You are an expert evaluator in complexity science and emergence theory. Provide an objective, multi-dimensional assessment of the candidate's performance.

Topic: ${topicName}
Question: ${question}

Candidate's Answer:
${answer}

Evaluate based on the following three dimensions:

1. Conceptual Accuracy (40 points): Correctness and precision of concepts and terminology
2. Argument Structure (30 points): Logic, organization, and completeness of response
3. Examples & Applications (30 points): Ability to provide relevant examples or real-world applications

Return in JSON format:
{
  "dimensions": [
    {
      "name": "Conceptual Accuracy",
      "score": 32,
      "maxScore": 40,
      "feedback": "Specific feedback"
    },
    {
      "name": "Argument Structure",
      "score": 25,
      "maxScore": 30,
      "feedback": "Specific feedback"
    },
    {
      "name": "Examples & Applications",
      "score": 22,
      "maxScore": 30,
      "feedback": "Specific feedback"
    }
  ],
  "totalScore": 79,
  "totalMaxScore": 100,
  "overallFeedback": "Overall feedback and suggestions (3-4 sentences)",
  "highlights": "Performance highlights",
  "improvements": "Areas for improvement"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a fair and professional evaluator who can objectively assess a candidate\'s understanding and communication abilities in complexity science and emergence theory.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Final score error:', error);
    return NextResponse.json(
      { error: 'Failed to generate final score', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

