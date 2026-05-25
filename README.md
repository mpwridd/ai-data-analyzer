# AI Data Analyzer

A modern AI-powered data analysis dashboard built with Next.js 14, TypeScript, and Tailwind CSS. Upload CSV or JSON files, preview data, get AI-generated insights, and visualize your data with interactive charts.

![AI Data Analyzer](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

## ✨ Features

- **📁 File Upload** — Drag-and-drop support for CSV and JSON files
- **📊 Data Preview** — View first 10 rows in a responsive table
- **📈 Smart Stats** — Automatic calculation of count, mean, min, max for numeric columns
- **🤖 AI Analysis** — Get AI-powered insights using Mimo v2.5 Pro
- **📉 Visualizations** — Interactive charts powered by Recharts
- **📝 Export** — Download analysis as Markdown
- **📱 Responsive** — Works on desktop and mobile
- **🎨 Modern UI** — Beautiful gradient design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17+ 
- npm 9+
- Mimo API key (or any OpenAI-compatible API)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-data-analyzer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your MIMO_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
MIMO_API_KEY=your_api_key_here
```

| Variable | Description | Required |
|----------|-------------|----------|
| `MIMO_API_KEY` | API key for Mimo v2.5 Pro | Yes |

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **CSV Parsing**: PapaParse
- **Icons**: Lucide React
- **AI**: Mimo v2.5 Pro (OpenAI-compatible)

## 🏗️ Project Structure

```
ai-data-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # AI analysis API endpoint
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main dashboard page
├── components/
│   ├── AnalysisCards.tsx       # AI insights display
│   ├── Charts.tsx             # Recharts visualizations
│   ├── DataSummary.tsx        # Statistics cards
│   ├── DataTable.tsx          # Data preview table
│   ├── FileUpload.tsx         # Drag-and-drop upload
│   └── Header.tsx             # App header
├── lib/
│   └── analysis.ts            # Data analysis utilities
├── types/
│   └── index.ts               # TypeScript types
├── .env.example               # Environment template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 📄 API Reference

### POST /api/analyze

Analyzes uploaded data and returns AI insights.

**Request Body:**
```json
{
  "data": [...],           // Array of data objects
  "columns": ["col1", "col2"], // Column names
  "stats": {               // Pre-computed statistics
    "col1": { "count": 100, "mean": 42, "min": 0, "max": 100 }
  }
}
```

**Response:**
```json
{
  "analysis": "AI-generated markdown analysis..."
}
```

## 🚢 Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add `MIMO_API_KEY` environment variable
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-data-analyzer)

## 📝 License

MIT

---

Built with ❤️ using Next.js 14 and Mimo v2.5 Pro
