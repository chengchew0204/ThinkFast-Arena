export interface UserContent {
  id: string;
  type: 'text' | 'url';
  title: string;
  rawContent: string;
  cleanedText: string;
  uploadedAt: number;
  status: 'processing' | 'ready' | 'error';
  metadata?: {
    wordCount: number;
    estimatedQuestions: number;
  };
  error?: string;
}

export interface GeneratedQuestion {
  id: string;
  contentId: string;
  question: string;
  context: string;
  difficulty: string;
  used: boolean;
}

export interface ContentUploadRequest {
  type: 'text' | 'url';
  content: string;
  title?: string;
}

export interface ContentProcessResponse {
  contentId: string;
  cleanedText: string;
  wordCount: number;
  status: 'ready' | 'error';
  error?: string;
}

export interface ContentAnalyzeResponse {
  questions: GeneratedQuestion[];
  count: number;
  contentId: string;
}

