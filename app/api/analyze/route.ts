import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  data: Record<string, unknown>[];
  columns: string[];
  stats: Record<string, {
    count: number;
    mean?: number;
    min?: number;
    max?: number;
    type: string;
    uniqueCount: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { data, columns, stats } = body;

    if (!data || !columns || !stats) {
      return NextResponse.json(
        { error: 'Missing required fields: data, columns, stats' },
        { status: 400 }
      );
    }

    const apiKey = process.env.MIMO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'MIMO_API_KEY environment variable is not configured' },
        { status: 500 }
      );
    }

    // Build a comprehensive data summary for the AI
    const summaryParts: string[] = [
      `Dataset has ${data.length} rows and ${columns.length} columns.`,
      `Columns: ${columns.join(', ')}.`,
      '',
      'Column Statistics:',
    ];

    columns.forEach((col) => {
      const stat = stats[col];
      if (stat) {
        if (stat.type === 'numeric') {
          summaryParts.push(
            `- ${col} (numeric): count=${stat.count}, mean=${stat.mean?.toFixed(2)}, min=${stat.min}, max=${stat.max}, unique=${stat.uniqueCount}`
          );
        } else {
          summaryParts.push(
            `- ${col} (text): count=${stat.count}, unique=${stat.uniqueCount}`
          );
        }
      }
    });

    // Include sample data (first 3 rows)
    summaryParts.push('', 'Sample data (first 3 rows):');
    data.slice(0, 3).forEach((row, i) => {
      summaryParts.push(`Row ${i + 1}: ${JSON.stringify(row)}`);
    });

    const dataSummary = summaryParts.join('\n');

    const prompt = `You are a data analyst expert. Analyze the following dataset and provide comprehensive insights.

${dataSummary}

Please provide your analysis in Markdown format with the following sections:

## 📊 Dataset Overview
Brief description of what this dataset appears to contain.

## 🔍 Key Insights
- 3-5 most important findings from the data
- Notable patterns, trends, or anomalies

## 📈 Statistical Highlights
- Key statistical observations
- Distribution insights
- Correlations you can identify

## 💡 Recommendations
- Suggested areas for deeper analysis
- Potential data quality issues
- Business implications

## ⚠️ Data Quality Notes
- Missing values or gaps
- Potential outliers
- Data consistency observations

Be specific with numbers from the statistics. Use clear, actionable language.`;

    const response = await fetch('http://100.91.112.121:8317/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Mimo-V2.5-Pro',
        messages: [
          {
            role: 'system',
            content: 'You are an expert data analyst. Provide clear, insightful analysis of datasets. Always use Markdown formatting.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mimo API error:', response.status, errorText);
      return NextResponse.json(
        { error: `AI API error: ${response.status}` },
        { status: 502 }
      );
    }

    const result = await response.json();
    const analysis = result.choices?.[0]?.message?.content;

    if (!analysis) {
      return NextResponse.json(
        { error: 'No analysis generated' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
