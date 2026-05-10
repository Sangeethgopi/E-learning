import shutil
import os
import uuid
from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.pdf_quiz_service import PDFQuizService

router = APIRouter(
    prefix="/pdf",
    tags=["AI PDF Engine"]
)

@router.post("/generate-quiz")
@router.post("/generate-quiz/")
async def generate_quiz_from_pdf(
    lesson_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Unique temp path for this request
    temp_path = f"temp_{uuid.uuid4()}.pdf"

    try:
        # Save uploaded file
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process with AI Service
        service = PDFQuizService(db)
        result = await service.process_pdf(
            temp_path,
            lesson_id
        )
        return result
    finally:
        # Clean up the file immediately after processing
        if os.path.exists(temp_path):
            os.remove(temp_path)
