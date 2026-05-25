'use client';

import { BarChart3, Hash, ArrowUp, ArrowDown, Columns3 } from 'lucide-react';
import { DataSummary } from '@/types';
import { formatNumber } from '@/lib/analysis';

interface DataSummaryProps {
  summary: DataSummary;
}

export default function DataSummaryCards({ summary }: DataSummaryProps) {
  const numericColumns = summary.columns.filter(
    (col) => summary.stats[col]?.type === 'numeric'
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-white shadow-lg shadow-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 opacity-80" />
            <span className="text-xs font-medium opacity-80">Rows</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(summary.totalRows, 0)}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white shadow-lg shadow-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Columns3 className="w-4 h-4 opacity-80" />
            <span className="text-xs font-medium opacity-80">Columns</span>
          </div>
          <p className="text-2xl font-bold">{summary.totalColumns}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 text-white shadow-lg shadow-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 opacity-80" />
            <span className="text-xs font-medium opacity-80">Numeric</span>
          </div>
          <p className="text-2xl font-bold">{numericColumns.length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-white shadow-lg shadow-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 opacity-80" />
            <span className="text-xs font-medium opacity-80">Text</span>
          </div>
          <p className="text-2xl font-bold">
            {summary.columns.length - numericColumns.length}
          </p>
        </div>
      </div>

      {/* Detailed Stats for Numeric Columns */}
      {numericColumns.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Numeric Column Statistics
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Column
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Count
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Mean
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Min
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Max
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {numericColumns.map((col) => {
                  const stat = summary.stats[col];
                  return (
                    <tr key={col} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-400" />
                          {col}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-600">
                        {formatNumber(stat.count, 0)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-indigo-600">
                        {stat.mean !== undefined ? formatNumber(stat.mean) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ArrowDown className="w-3 h-3 text-emerald-500" />
                          <span className="font-mono text-emerald-600">
                            {stat.min !== undefined ? formatNumber(stat.min) : '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ArrowUp className="w-3 h-3 text-rose-500" />
                          <span className="font-mono text-rose-600">
                            {stat.max !== undefined ? formatNumber(stat.max) : '-'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
