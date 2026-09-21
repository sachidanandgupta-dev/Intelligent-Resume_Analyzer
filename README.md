# 🎯 Intelligent Resume Analyzer

> AI-powered resume analysis with ATS scoring, skill extraction, and improvement suggestions

## 🏗️ Tech Stack
- **Backend:** Python, FastAPI, Gemini API (gemini-2.5-flash), pypdf
- **Frontend:** React.js, Vite, Tailwind CSS, Recharts
- **AI:** LLM-powered structured extraction + ATS scoring

## 📐 How It Works
```
PDF Upload → Text Extraction (pypdf) → Gemini API Prompt (structured JSON)
    → ATS Score Breakdown → Skills Extraction → Improvement Suggestions → Dashboard
```

## 🚀 How to Run

### 1. Backend
```bash
cd backend
cp .env .env.local          # Add your GEMINI_API_KEY
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
# OR: bash run.sh
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5174
```

## 🔑 Environment Variables
```
GEMINI_API_KEY=your_gemini_api_key_here   # Required
```

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/analyze` | Analyze resume PDF (+ optional JD) |

### Request (multipart/form-data)
- `file`: PDF file (required)
- `job_description`: string (optional, enables match scoring)

### Response Structure
```json
{
  "candidate_info": { "name", "email", "phone", "linkedin", "github" },
  "ats_score": 78,
  "ats_score_breakdown": { "keyword_optimization": 20, "formatting_clarity": 22, ... },
  "skills": { "technical": [], "soft": [], "tools": [], "languages": [] },
  "experience_summary": { "total_years", "roles", "highlights" },
  "projects": [{ "name", "tech_stack", "description" }],
  "improvements": [{ "priority": "HIGH", "area", "suggestion" }],
  "job_match_score": 85,
  "overall_verdict": "Strong Candidate"
}
```


