from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import resume

app = FastAPI(
    title="Intelligent Resume Analyzer",
    description="AI-powered Resume Analysis with ATS Scoring",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])

@app.get("/")
def root():
    return {"message": "Intelligent Resume Analyzer API", "status": "running"}
