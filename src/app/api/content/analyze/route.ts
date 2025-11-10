import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { storeQuestions, debugStorage } from '@/utils/contentStore';
import { GeneratedQuestion, ContentAnalyzeResponse } from '@/types/content';

export async function POST(req: NextRequest) {
  try {
    const { contentId, cleanedText, questionCount = 15 } = await req.json();

    if (!contentId || !cleanedText) {
      return NextResponse.json(
        { error: 'Missing required fields: contentId and cleanedText' },
        { status: 400 }
      );
    }

    if (questionCount < 5 || questionCount > 30) {
      return NextResponse.json(
        { error: 'Question count must be between 5 and 30' },
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

    console.log(`Generating ${questionCount} questions for content ${contentId}`);

    const prompt = `You are an educational expert. Analyze the following learning material and generate EXACTLY ${questionCount} open-ended discussion questions that:

1. Test deep understanding, not memorization
2. Are answerable in 60-90 seconds of spoken explanation
3. Use scenario-based or application-focused framing
4. Avoid yes/no or simple factual recall questions
5. Challenge learners to explain relationships, implications, and applications
6. Cover different aspects and concepts from the material
7. Vary in difficulty from medium to challenging

IMPORTANT: Each question should be 2-3 sentences maximum and focus on ONE main concept.

Content:
${cleanedText.slice(0, 10000)}

Return a JSON object with this structure:
{
  "questions": [
    {
      "question": "The actual question text (2-3 sentences, clear and focused)",
      "context": "Brief context about what this question tests",
      "difficulty": "medium" or "hard"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator who excels at creating thought-provoking discussion questions that test understanding and application of concepts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"questions":[]}');
    
    if (!result.questions || !Array.isArray(result.questions)) {
      throw new Error('Invalid response format from AI');
    }

    const filteredQuestions = result.questions.filter((q: any) => {
      const questionText = q.question || '';
      const wordCount = questionText.split(/\s+/).length;
      
      if (wordCount < 10) return false;
      if (wordCount > 100) return false;
      
      const lowerQuestion = questionText.toLowerCase();
      if (
        lowerQuestion.match(/^(is|are|do|does|did|can|could|will|would|should)\s/) &&
        !lowerQuestion.includes('how') &&
        !lowerQuestion.includes('why') &&
        !lowerQuestion.includes('what') &&
        !lowerQuestion.includes('explain')
      ) {
        return false;
      }
      
      return true;
    });

    if (filteredQuestions.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate quality questions from the content' },
        { status: 500 }
      );
    }

    const generatedQuestions: GeneratedQuestion[] = filteredQuestions.map((q: any, index: number) => ({
      id: `q_${contentId}_${index}_${Date.now()}`,
      contentId,
      question: q.question,
      context: q.context || '',
      difficulty: q.difficulty || 'medium',
      used: false,
    }));

    console.log(`Successfully generated ${generatedQuestions.length} questions for contentId: ${contentId}`);
    storeQuestions(contentId, generatedQuestions);
    console.log('Questions stored successfully');
    debugStorage(); // Show what's in storage after storing

    const response: ContentAnalyzeResponse = {
      questions: generatedQuestions,
      count: generatedQuestions.length,
      contentId,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Content analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze content and generate questions', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

