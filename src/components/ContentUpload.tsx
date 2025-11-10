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
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-white max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <h2 className="text-white text-xl font-light">Upload Learning Content</h2>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-gray-400 hover:text-white disabled:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('text')}
              disabled={isProcessing}
              className={`pb-2 px-4 transition-colors ${
                activeTab === 'text'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-gray-300'
              } disabled:opacity-50`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setActiveTab('url')}
              disabled={isProcessing}
              className={`pb-2 px-4 transition-colors ${
                activeTab === 'url'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-gray-300'
              } disabled:opacity-50`}
            >
              Enter URL
            </button>
          </div>

          {/* Title Input (optional) */}
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              disabled={isProcessing}
              placeholder="e.g., Chapter 3: Neural Networks"
              className="w-full bg-black border border-gray-700 text-white px-4 py-2 focus:border-white outline-none disabled:opacity-50"
            />
            <p className="text-gray-500 text-xs">
              {title.length}/100 characters
            </p>
          </div>

          {/* Question Count Input */}
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Number of Questions</label>
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
              className="w-full bg-black border border-gray-700 text-white px-4 py-2 focus:border-white outline-none disabled:opacity-50"
            />
            <p className="text-gray-500 text-xs">
              Choose between 5-30 questions (default: 15)
            </p>
          </div>

          {/* Content Input */}
          {activeTab === 'text' ? (
            <div className="space-y-2">
              <label className="text-gray-400 text-sm">Paste your learning content</label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                disabled={isProcessing}
                placeholder="Paste your text here (minimum 500 characters)..."
                className="w-full h-64 bg-black border border-gray-700 text-white px-4 py-2 focus:border-white outline-none resize-none disabled:opacity-50"
              />
              <div className="flex justify-between text-xs">
                <span className={`${
                  charCount < charMin
                    ? 'text-yellow-500'
                    : isTextValid
                    ? 'text-green-500'
                    : 'text-red-500'
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
              <label className="text-gray-400 text-sm">Enter URL to article or webpage</label>
              <input
                type="url"
                value={urlContent}
                onChange={(e) => setUrlContent(e.target.value)}
                disabled={isProcessing}
                placeholder="https://example.com/article"
                className="w-full bg-black border border-gray-700 text-white px-4 py-2 focus:border-white outline-none disabled:opacity-50"
              />
              <p className="text-gray-500 text-xs">
                We'll fetch and extract the main content from the page
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="border border-red-500 bg-red-900 bg-opacity-20 p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="border border-white p-4 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white mx-auto"></div>
              <p className="text-white text-sm">{processingStep}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white px-6 py-2 transition-colors disabled:opacity-50"
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
              className="border border-white text-white hover:bg-white hover:text-black px-6 py-2 transition-colors disabled:opacity-50 disabled:border-gray-600 disabled:text-gray-600 disabled:hover:bg-transparent disabled:hover:text-gray-600"
            >
              {isProcessing ? 'Processing...' : 'Generate Questions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

