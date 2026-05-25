export interface DataRow {
  [key: string]: string | number | boolean | null;
}

export interface ColumnStats {
  count: number;
  mean?: number;
  min?: number;
  max?: number;
  sum?: number;
  type: 'numeric' | 'string' | 'boolean' | 'mixed';
  uniqueCount: number;
  nullCount: number;
}

export interface DataSummary {
  totalRows: number;
  totalColumns: number;
  columns: string[];
  stats: Record<string, ColumnStats>;
}

export interface AnalysisResult {
  analysis: string;
  timestamp: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
