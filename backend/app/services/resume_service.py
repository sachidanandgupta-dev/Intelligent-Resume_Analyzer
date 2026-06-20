import json
import re
from typing import Optional
from google import genai
from pypdf import PdfReader

from app.core.config import settings


def _extract_json(raw_text: str) -> dict:
    """Robustly extract a JSON object from a Claude response, regardless of
    whether it's wrapped in ```json fences, plain ``` fences, or has
    leading/trailing prose."""
    text = raw_text.strip()

    # Strip ```json ... ``` or ``` ... ``` fences if present
    fence_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if fence_match:
        text = fence_match.group(1).strip()

    # As a fallback, grab the outermost {...} block in case of stray prose
    if not text.startswith('{'):
        brace_match = re.search(r'\{[\s\S]*\}', text)
        if brace_match:
            text = brace_match.group(0)

    return json.loads(text)


def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text.strip()


def analyze_resume(resume_text: str, job_description: Optional[str] = None) -> dict:
    """Main resume analysis function using Gemini."""
    
    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    job_context = ""
    if job_description:
        job_context = f"\n\nJOB DESCRIPTION TO MATCH AGAINST:\n{job_description}\n"

    prompt = f"""You are an expert ATS (Applicant Tracking System) and professional resume analyst with 10+ years of HR experience.

Analyze the following resume and provide a comprehensive evaluation.{job_context}

RESUME TEXT:
{resume_text}

Return your analysis as a JSON object with EXACTLY this structure (no extra text, no markdown fences):
{{
  "candidate_info": {{
    "name": "Full name",
    "email": "email if found",
    "phone": "phone if found",
    "location": "location if found",
    "linkedin": "linkedin url if found",
    "github": "github url if found"
  }},
  "ats_score": <number 0-100>,
  "ats_score_breakdown": {{
    "keyword_optimization": <0-25>,
    "formatting_clarity": <0-25>,
    "experience_relevance": <0-25>,
    "skills_completeness": <0-25>
  }},
  "skills": {{
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"],
    "languages": ["lang1", "lang2"]
  }},
  "experience_summary": {{
    "total_years": <number or null>,
    "roles": ["role1", "role2"],
    "highlights": ["highlight1", "highlight2", "highlight3"]
  }},
  "education": [
    {{
      "degree": "degree name",
      "institution": "university name",
      "year": "year or period",
      "gpa": "gpa if mentioned"
    }}
  ],
  "projects": [
    {{
      "name": "project name",
      "tech_stack": ["tech1", "tech2"],
      "description": "brief description"
    }}
  ],
  "certifications": ["cert1", "cert2"],
  "strengths": ["strength1", "strength2", "strength3", "strength4"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "improvements": [
    {{
      "priority": "HIGH",
      "area": "area name",
      "suggestion": "specific actionable suggestion"
    }},
    {{
      "priority": "MEDIUM",
      "area": "area name",
      "suggestion": "specific actionable suggestion"
    }},
    {{
      "priority": "LOW",
      "area": "area name",
      "suggestion": "specific actionable suggestion"
    }}
  ],
  "job_match_score": <0-100 or null if no JD provided>,
  "job_match_analysis": "brief analysis of match or null",
  "missing_keywords": ["keyword1", "keyword2"],
  "overall_verdict": "Strong Candidate | Good Candidate | Needs Improvement | Not Recommended",
  "summary": "2-3 sentence professional summary of the resume"
}}"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    raw = response.text.strip()
    return _extract_json(raw)
