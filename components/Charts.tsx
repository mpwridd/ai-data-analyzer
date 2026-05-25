'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DataRow, DataSummary } from '@/types';

interface ChartsProps {
  data: DataRow[];
  summary: DataSummary;
}

export default function Charts({ data, summary }: ChartsProps) {
  const numericColumns = useMemo(
    () => summary.columns.filter((col) => summary.stats[col]?.type === 'numeric'),
    [summary]
  );

  const chartData = useMemo(() => {
    if (numericColumns.length === 0) return [];

    // Sample up to 30 data points for visualization
    const maxPoints = 30;
    const step = Math.max(1, Math.floor(data.length / maxPoints));
    const sampled = data.filter((_, i) => i % step === 0).slice(0, maxPoints);

    return sampled.map((row, index) => {
      const point: Record<string, string | number> = {
        name: `Row ${index + 1}`,
      };
      numericColumns.forEach((col) => {
        const val = parseFloat(String(row[col]));
        point[col] = isNaN(val) ? 0 : val;
      });
      return point;
    });
  }, [data, numericColumns]);

  const COLORS = [
    '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd',
    '#818cf8', '#6d28d9', '#4f46e5', '#7c3aed',
  ];

  if (numericColumns.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm text-center">
        <p className="text-gray-500">No numeric columns to visualize</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart for numeric columns */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">
            Numeric Data Distribution
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Values across {Math.min(data.length, 30)} sampled rows
          </p>
        </div>
        <div className="p-4 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              {numericColumns.slice(0, 5).map((col, index) => (
                <Bar
                  key={col}
                  dataKey={col}
                  fill={COLORS[index % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual column mini charts */}
      {numericColumns.length > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {numericColumns.slice(0, 4).map((col, index) => (
            <div
              key={col}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-50">
                <h4 className="text-sm font-medium text-gray-900">{col}</h4>
                <p className="text-xs text-gray-500">
                  Mean: {summary.stats[col]?.mean?.toFixed(2)}
                </p>
              </div>
              <div className="p-2 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={false} stroke="#e2e8f0" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar
                      dataKey={col}
                      fill={COLORS[index % COLORS.length]}
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
