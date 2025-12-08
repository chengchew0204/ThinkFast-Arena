'use client';

import { useState } from 'react';
import { ContentUploadRequest } from '@/types/content';

interface ContentUploadProps {
  onUploadComplete: (contentId: string, title: string, questionCount: number) => void;
  onClose: () => void;
}

export default function ContentUpload({ onUploadComplete, onClose }: ContentUploadProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'url'>('text');
  const [textContent, setTextContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [title, setTitle] = useState('');
  const [questionCount, setQuestionCount] = useState(15);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState('');

  const validateText = (text: string): string | null => {
    if (text.length < 500) {
      return 'Text is too short. Please provide at least 500 characters for quality question generation.';
    }
    if (text.length > 50000) {
      return 'Text is too long. Please provide content under 50,000 characters.';
    }
    return null;
  };

  const validateUrl = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return 'Invalid URL. Please use http:// or https://';
      }
      return null;
    } catch {
      return 'Invalid URL format. Please enter a valid URL.';
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      let content: string;
      let type: 'text' | 'url';
      let autoTitle: string;

      if (activeTab === 'text') {
        const validationError = validateText(textContent);
        if (validationError) {
          setError(validationError);
          setIsProcessing(false);
          return;
        }
        content = textContent;
        type = 'text';
        autoTitle = title || `Text Content (${new Date().toLocaleDateString()})`;
      } else {
        const validationError = validateUrl(urlContent);
        if (validationError) {
          setError(validationError);
          setIsProcessing(false);
          return;
        }
        content = urlContent;
        type = 'url';
        autoTitle = title || urlContent;
      }

      // Step 1: Process content
      setProcessingStep('Processing content...');
      const processResponse = await fetch('/api/content/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          content,
          title: autoTitle,
        } as ContentUploadRequest),
      });

      if (!processResponse.ok) {
        const errorData = await processResponse.json().catch(() => ({ error: 'Failed to process content' }));
        throw new Error(errorData.error || 'Failed to process content');
      }

      const processData = await processResponse.json();
      const { contentId, cleanedText } = processData;

      // Step 2: Generate questions
      setProcessingStep(`Generating ${questionCount} questions from content...`);
      const analyzeResponse = await fetch('/api/content/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          cleanedText,
          questionCount,
        }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({ error: 'Failed to generate questions' }));
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const analyzeData = await analyzeResponse.json();
      const { count } = analyzeData;

      // Success!
      setIsProcessing(false);
      onUploadComplete(contentId, autoTitle, count);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const charCount = activeTab === 'text' ? textContent.length : 0;
  const charLimit = 50000;
  const charMin = 500;
  const isTextValid = charCount >= charMin && charCount <= charLimit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <h2 className="text-gray-900 text-xl font-medium">Upload Learning Content</h2>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-gray-500 hover:text-gray-800 disabled:text-gray-300 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('text')}
              disabled={isProcessing}
              className={`pb-2 px-4 transition-colors ${
                activeTab === 'text'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-800'
              } disabled:opacity-50`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setActiveTab('url')}
              disabled={isProcessing}
              className={`pb-2 px-4 transition-colors ${
                activeTab === 'url'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-800'
              } disabled:opacity-50`}
            >
              Enter URL
            </button>
          </div>

          {/* Title Input (optional) */}
          <div className="space-y-2">
            <label className="text-gray-700 text-sm font-medium">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              disabled={isProcessing}
              placeholder="e.g., Chapter 3: Neural Networks"
              className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:opacity-50 rounded-lg"
            />
            <p className="text-gray-500 text-xs">
              {title.length}/100 characters
            </p>
          </div>

          {/* Question Count Input */}
          <div className="space-y-2">
            <label className="text-gray-700 text-sm font-medium">Number of Questions</label>
            <input
              type="number"
              value={questionCount}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 5 && val <= 30) {
                  setQuestionCount(val);
                }
              }}
              disabled={isProcessing}
              min="5"
              max="30"
              className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:opacity-50 rounded-lg"
            />
            <p className="text-gray-500 text-xs">
              Choose between 5-30 questions (default: 15)
            </p>
          </div>

          {/* Content Input */}
          {activeTab === 'text' ? (
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">Paste your learning content</label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                disabled={isProcessing}
                placeholder="Paste your text here (minimum 500 characters)..."
                className="w-full h-64 bg-white border border-gray-300 text-gray-800 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none disabled:opacity-50 rounded-lg"
              />
              <div className="flex justify-between text-xs">
                <span className={`${
                  charCount < charMin
                    ? 'text-amber-600'
                    : isTextValid
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {charCount.toLocaleString()} / {charMin.toLocaleString()} min
                </span>
                <span className="text-gray-500">
                  {charCount.toLocaleString()} / {charLimit.toLocaleString()} max
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">Enter URL to article or webpage</label>
              <input
                type="url"
                value={urlContent}
                onChange={(e) => setUrlContent(e.target.value)}
                disabled={isProcessing}
                placeholder="https://example.com/article"
                className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:opacity-50 rounded-lg"
              />
              <p className="text-gray-500 text-xs">
                We'll fetch and extract the main content from the page
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="border border-red-400 bg-red-50 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="border border-blue-300 bg-blue-50 rounded-lg p-4 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mx-auto"></div>
              <p className="text-blue-700 text-sm">{processingStep}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 transition-colors disabled:opacity-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                isProcessing ||
                (activeTab === 'text' && !isTextValid) ||
                (activeTab === 'url' && !urlContent)
              }
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 transition-colors disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg shadow-md"
            >
              {isProcessing ? 'Processing...' : 'Generate Questions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

