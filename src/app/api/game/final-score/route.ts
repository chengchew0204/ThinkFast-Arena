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

Evaluate based on the following four dimensions:

1. Concept Accuracy (30 points): Correctness of core concepts
2. Structural Coherence (25 points): Logical organization and clarity
3. Practical Examples (25 points): Real-world applications
4. Response Quality (20 points): Communication effectiveness

CRITICAL RULES:
- You MUST calculate actual scores based on the answer quality. Do NOT use the example numbers below.
- If the answer is empty, blank, or completely unrelated to the topic, give 0 points for ALL dimensions.
- If the answer shows no understanding of the topic or is nonsensical, give 0 points for ALL dimensions.

Return in JSON format with your calculated scores:
{
  "dimensions": [
    {
      "name": "Concept Accuracy",
      "score": <your_calculated_score_0_to_30>,
      "maxScore": 30,
      "feedback": "Specific feedback on concept accuracy"
    },
    {
      "name": "Structural Coherence",
      "score": <your_calculated_score_0_to_25>,
      "maxScore": 25,
      "feedback": "Specific feedback on structural coherence"
    },
    {
      "name": "Practical Examples",
      "score": <your_calculated_score_0_to_25>,
      "maxScore": 25,
      "feedback": "Specific feedback on practical examples"
    },
    {
      "name": "Response Quality",
      "score": <your_calculated_score_0_to_20>,
      "maxScore": 20,
      "feedback": "Specific feedback on response quality"
    }
  ],
  "totalScore": <sum_of_all_dimension_scores>,
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

