import { DataRow, ColumnStats, DataSummary } from '@/types';

export function analyzeData(data: DataRow[]): DataSummary {
  if (!data || data.length === 0) {
    return {
      totalRows: 0,
      totalColumns: 0,
      columns: [],
      stats: {},
    };
  }

  const columns = Object.keys(data[0]);
  const stats: Record<string, ColumnStats> = {};

  columns.forEach((col) => {
    const values = data.map((row) => row[col]);
    const nonNullValues = values.filter((v) => v !== null && v !== undefined && v !== '');
    const nullCount = values.length - nonNullValues.length;

    // Check if column is numeric
    const numericValues = nonNullValues
      .map((v) => (typeof v === 'number' ? v : parseFloat(String(v))))
      .filter((v) => !isNaN(v));

    const isNumeric = numericValues.length > nonNullValues.length * 0.8;

    if (isNumeric && numericValues.length > 0) {
      const sum = numericValues.reduce((a, b) => a + b, 0);
      stats[col] = {
        count: nonNullValues.length,
        mean: sum / numericValues.length,
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        sum,
        type: 'numeric',
        uniqueCount: new Set(numericValues).size,
        nullCount,
      };
    } else {
      const uniqueValues = new Set(nonNullValues.map(String));
      stats[col] = {
        count: nonNullValues.length,
        type: 'string',
        uniqueCount: uniqueValues.size,
        nullCount,
      };
    }
  });

  return {
    totalRows: data.length,
    totalColumns: columns.length,
    columns,
    stats,
  };
}

export function getNumericColumns(summary: DataSummary): string[] {
  return summary.columns.filter((col) => summary.stats[col]?.type === 'numeric');
}

export function formatNumber(num: number, decimals = 2): string {
  if (Number.isInteger(num)) return num.toLocaleString();
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function generateChartData(
  data: DataRow[],
  xColumn: string,
  yColumns: string[]
): { name: string; [key: string]: string | number }[] {
  // Sample up to 50 data points for charts
  const sampled = data.length > 50 ? data.filter((_, i) => i % Math.ceil(data.length / 50) === 0) : data;

  return sampled.map((row, index) => {
    const point: { name: string; [key: string]: string | number } = {
      name: String(row[xColumn] ?? index),
    };
    yColumns.forEach((col) => {
      const val = parseFloat(String(row[col]));
      point[col] = isNaN(val) ? 0 : val;
    });
    return point;
  });
}

export function exportAnalysisMarkdown(
  summary: DataSummary,
  aiAnalysis: string,
  data: DataRow[]
): string {
  const lines: string[] = [];

  lines.push('# Data Analysis Report');
  lines.push('');
  lines.push(`Generated on ${new Date().toLocaleString()}`);
  lines.push('');
  lines.push('## Dataset Overview');
  lines.push('');
  lines.push(`- **Total Rows:** ${summary.totalRows}`);
  lines.push(`- **Total Columns:** ${summary.totalColumns}`);
  lines.push('');

  lines.push('## Column Statistics');
  lines.push('');
  lines.push('| Column | Type | Count | Mean | Min | Max | Unique |');
  lines.push('|--------|------|-------|------|-----|-----|--------|');

  summary.columns.forEach((col) => {
    const stat = summary.stats[col];
    if (stat) {
      const mean = stat.mean !== undefined ? formatNumber(stat.mean) : '-';
      const min = stat.min !== undefined ? formatNumber(stat.min) : '-';
      const max = stat.max !== undefined ? formatNumber(stat.max) : '-';
      lines.push(
        `| ${col} | ${stat.type} | ${stat.count} | ${mean} | ${min} | ${max} | ${stat.uniqueCount} |`
      );
    }
  });

  lines.push('');
  lines.push('## AI Analysis');
  lines.push('');
  lines.push(aiAnalysis);
  lines.push('');
  lines.push('## Sample Data (First 10 Rows)');
  lines.push('');

  if (data.length > 0) {
    const cols = Object.keys(data[0]);
    lines.push('| ' + cols.join(' | ') + ' |');
    lines.push('| ' + cols.map(() => '---').join(' | ') + ' |');

    data.slice(0, 10).forEach((row) => {
      lines.push('| ' + cols.map((c) => String(row[c] ?? '')).join(' | ') + ' |');
    });
  }

  lines.push('');
  lines.push('---');
  lines.push('*Analysis powered by Mimo v2.5 Pro*');

  return lines.join('\n');
}
