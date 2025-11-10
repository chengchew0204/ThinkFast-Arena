import { NextResponse } from 'next/server';
import { getAllContent } from '@/utils/contentStore';

export async function GET() {
  try {
    const allContent = getAllContent();
    
    // Also check question pools directly
    const contentStore = require('@/utils/contentStore');
    
    return NextResponse.json({
      contentCount: allContent.length,
      contents: allContent.map(c => ({
        id: c.id,
        title: c.title,
        wordCount: c.metadata?.wordCount,
        status: c.status,
      })),
      // Try to access questionPools directly for debugging
      debug: 'Check server console for detailed logs',
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

