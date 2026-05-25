'use client';

import { DataRow } from '@/types';

interface DataTableProps {
  data: DataRow[];
  columns: string[];
}

export default function DataTable({ data, columns }: DataTableProps) {
  const displayData = data.slice(0, 10);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Data Preview</h3>
        <p className="text-xs text-gray-500 mt-1">
          Showing first {displayData.length} of {data.length} rows
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                  {rowIndex + 1}
                </td>
                {columns.map((col) => {
                  const value = row[col];
                  const isNumeric = typeof value === 'number';
                  return (
                    <td
                      key={col}
                      className={`px-4 py-3 ${
                        isNumeric ? 'font-mono text-indigo-600' : 'text-gray-700'
                      }`}
                    >
                      {value === null || value === undefined ? (
                        <span className="text-gray-300 italic">null</span>
                      ) : (
                        String(value)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
