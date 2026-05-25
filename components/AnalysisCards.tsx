'use client';

import { Sparkles, RefreshCw, AlertCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface AnalysisCardsProps {
  analysis: string | null;
  isLoading: boolean;
  error: string | null;
  onAnalyze: () => void;
  hasData: boolean;
}

export default function AnalysisCards({
  analysis,
  isLoading,
  error,
  onAnalyze,
  hasData,
}: AnalysisCardsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (analysis) {
      await navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Parse analysis into sections
  const sections = analysis
    ? parseAnalysisSections(analysis)
    : [];

  return (
    <div className="space-y-4">
      {/* Analyze Button */}
      <button
        onClick={onAnalyze}
        disabled={!hasData || isLoading}
        className={`
          w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm
          flex items-center justify-center gap-2
          transition-all duration-300 transform
          ${
            hasData && !isLoading
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            AI Analyze
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Analysis Error</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                  <div className="h-3 bg-gray-100 rounded w-4/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !isLoading && (
        <div className="space-y-4">
          {/* Copy button */}
          <div className="flex justify-end">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy Analysis
                </>
              )}
            </button>
          </div>

          {/* Rendered sections */}
          {sections.length > 0 ? (
            sections.map((section, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
              >
                {section.title && (
                  <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                )}
                <div className="px-6 py-4 analysis-content">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(section.content),
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 analysis-content">
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(analysis),
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!analysis && !isLoading && !error && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
          <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Upload a file and click &quot;AI Analyze&quot; to get insights
          </p>
        </div>
      )}
    </div>
  );
}

function parseAnalysisSections(markdown: string): { title: string; content: string }[] {
  const sections: { title: string; content: string }[] = [];
  const lines = markdown.split('\n');
  let currentTitle = '';
  let currentContent: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith('## ')) {
      if (currentTitle || currentContent.length > 0) {
        sections.push({
          title: currentTitle,
          content: currentContent.join('\n'),
        });
      }
      currentTitle = line.replace('## ', '').replace(/[📊🔍📈💡⚠️]/g, '').trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  });

  if (currentTitle || currentContent.length > 0) {
    sections.push({
      title: currentTitle,
      content: currentContent.join('\n'),
    });
  }

  return sections;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^- (.*)/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*)/gm, '<li>$2</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/<li>/g, '<ul><li>')
    .replace(/<\/li>(?![\s\S]*<li>)/g, '</li></ul>')
    .replace(/<\/ul><ul>/g, '')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/<p><\/p>/g, '');
}
