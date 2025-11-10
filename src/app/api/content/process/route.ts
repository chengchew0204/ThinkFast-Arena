import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';
import { storeContent } from '@/utils/contentStore';
import { ContentUploadRequest, ContentProcessResponse } from '@/types/content';

export async function POST(req: NextRequest) {
  try {
    const body: ContentUploadRequest = await req.json();
    const { type, content, title } = body;

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: type and content' },
        { status: 400 }
      );
    }

    let cleanedText = '';
    let wordCount = 0;

    if (type === 'text') {
      // Process text content
      cleanedText = content
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n\s*\n+/g, '\n\n');
      
      wordCount = cleanedText.split(/\s+/).length;

      if (wordCount < 100) {
        return NextResponse.json(
          { error: 'Content too short. Minimum 100 words required.' },
          { status: 400 }
        );
      }

      if (wordCount > 20000) {
        cleanedText = cleanedText.split(/\s+/).slice(0, 20000).join(' ');
        wordCount = 20000;
      }

    } else if (type === 'url') {
      // Fetch and parse URL content
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(content, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; EducationalBot/1.0)',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch URL`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('text/html')) {
          throw new Error('URL does not point to an HTML page');
        }

        const html = await response.text();
        const $ = load(html);

        $('script, style, nav, header, footer, aside, iframe, noscript').remove();

        const mainContent = 
          $('article').text() || 
          $('main').text() || 
          $('.content').text() ||
          $('.post-content').text() ||
          $('.entry-content').text() ||
          $('body').text();

        cleanedText = mainContent
          .trim()
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n\s*\n+/g, '\n\n');

        wordCount = cleanedText.split(/\s+/).length;

        if (wordCount < 100) {
          throw new Error('Extracted content is too short. The URL may not contain enough text.');
        }

        if (wordCount > 20000) {
          cleanedText = cleanedText.split(/\s+/).slice(0, 20000).join(' ');
          wordCount = 20000;
        }

      } catch (fetchError: any) {
        console.error('URL fetch error:', fetchError);
        
        if (fetchError.name === 'AbortError') {
          return NextResponse.json(
            { error: 'Request timeout. The URL took too long to respond.' },
            { status: 408 }
          );
        }

        return NextResponse.json(
          { 
            error: `Failed to fetch URL: ${fetchError.message || 'Unknown error'}. Try pasting the text directly instead.` 
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid content type. Must be "text" or "url"' },
        { status: 400 }
      );
    }

    const contentId = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const contentTitle = title || (type === 'url' ? content : `Text Content (${new Date().toLocaleDateString()})`);

    const userContent = {
      id: contentId,
      type,
      title: contentTitle,
      rawContent: content,
      cleanedText,
      uploadedAt: Date.now(),
      status: 'ready' as const,
      metadata: {
        wordCount,
        estimatedQuestions: Math.floor(wordCount / 100),
      },
    };

    storeContent(userContent);

    const response: ContentProcessResponse = {
      contentId,
      cleanedText,
      wordCount,
      status: 'ready',
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Content processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process content', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

