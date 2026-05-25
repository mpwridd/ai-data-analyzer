'use client';

import { BarChart3, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Data Analyzer
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Upload, analyze, and visualize your data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-medium text-indigo-700">Powered by Mimo v2.5 Pro</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
