'use client';

import { useState, useCallback } from 'react';
import { Download, RotateCcw, FileJson, Table2 } from 'lucide-react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import DataTable from '@/components/DataTable';
import DataSummaryCards from '@/components/DataSummary';
import Charts from '@/components/Charts';
import AnalysisCards from '@/components/AnalysisCards';
import { DataRow, DataSummary, AnalysisResult } from '@/types';
import { analyzeData, exportAnalysisMarkdown } from '@/lib/analysis';

export default function Home() {
  const [data, setData] = useState<DataRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'charts'>('preview');

  const handleDataLoaded = useCallback((loadedData: DataRow[], name: string) => {
    setData(loadedData);
    setFileName(name);
    setSummary(analyzeData(loadedData));
    setAnalysis(null);
    setAnalysisError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!summary || data.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: data.slice(0, 50), // Send first 50 rows for context
          columns: summary.columns,
          stats: summary.stats,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      setAnalysis(result);
    } catch (err) {
      setAnalysisError(
        err instanceof Error ? err.message : 'Failed to analyze data'
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [summary, data]);

  const handleExport = useCallback(() => {
    if (!summary || !analysis) return;

    const markdown = exportAnalysisMarkdown(summary, analysis.analysis, data);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${fileName.replace(/\.[^/.]+$/, '')}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [summary, analysis, data, fileName]);

  const handleReset = useCallback(() => {
    setData([]);
    setFileName('');
    setSummary(null);
    setAnalysis(null);
    setAnalysisError(null);
  }, []);

  const columns = summary?.columns || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Upload Section */}
        <section>
          <FileUpload onDataLoaded={handleDataLoaded} />
        </section>

        {/* Data Loaded - Show Dashboard */}
        {data.length > 0 && summary && (
          <>
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <FileJson className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">{fileName}</span>
                  <span className="text-xs text-gray-400">
                    ({summary.totalRows} rows × {summary.totalColumns} cols)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {analysis && (
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100"
                  >
                    <Download className="w-4 h-4" />
                    Export Markdown
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <section>
              <DataSummaryCards summary={summary} />
            </section>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-gray-100 w-fit shadow-sm">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'preview'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Table2 className="w-4 h-4" />
                Data Preview
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'charts'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Table2 className="w-4 h-4" />
                Charts
              </button>
            </div>

            {/* Content Area */}
            <section>
              {activeTab === 'preview' ? (
                <DataTable data={data} columns={columns} />
              ) : (
                <Charts data={data} summary={summary} />
              )}
            </section>

            {/* AI Analysis */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">AI Analysis</h2>
              </div>
              <AnalysisCards
                analysis={analysis?.analysis || null}
                isLoading={isAnalyzing}
                error={analysisError}
                onAnalyze={handleAnalyze}
                hasData={data.length > 0}
              />
            </section>
          </>
        )}

        {/* Empty State */}
        {data.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center animate-float">
              <Table2 className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Ready to analyze your data
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Upload a CSV or JSON file to get started. The AI will analyze your data
              and provide comprehensive insights.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              © 2024 AI Data Analyzer. Built with Next.js 14 & Mimo v2.5 Pro
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>TypeScript</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>Recharts</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
