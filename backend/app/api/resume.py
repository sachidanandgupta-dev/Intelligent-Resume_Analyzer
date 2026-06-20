import os
import uuid
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.core.config import settings
from app.services import resume_service

router = APIRouter()

Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)


@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"File too large. Max: {settings.MAX_FILE_SIZE_MB}MB")

    file_id = str(uuid.uuid4())[:8]
    file_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}_{file.filename}")

    with open(file_path, "wb") as f:
        f.write(content)

    try:
        resume_text = resume_service.extract_text_from_pdf(file_path)
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        result = resume_service.analyze_resume(resume_text, job_description)
        return {"success": True, "filename": file.filename, "analysis": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
