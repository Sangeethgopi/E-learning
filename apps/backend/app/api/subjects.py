from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.subject import SubjectCreate
from app.schemas.subject import SubjectResponse
from app.services.subject_service import (
    SubjectService)

router = APIRouter(
    prefix="/subjects",
    tags=["Subjects"]
)


@router.post(
    "/",
    response_model=SubjectResponse
)
def create_subject(
    subject_data: SubjectCreate,
    db: Session = Depends(get_db)
):
    service = SubjectService(db)
    return service.create_subject(
        subject_data
    )


@router.get(
    "/",
    response_model=list[SubjectResponse]
)
def get_subjects(
    skip: int = 0,
    limit: int = 10,
    search: str | None = None,
    db: Session = Depends(get_db)
):
    service = SubjectService(db)
    return service.get_all_subjects(skip=skip, limit=limit, search=search)


@router.get(
    "/{subject_id}",
    response_model=SubjectResponse
)
def get_subject(
    subject_id,
    db: Session = Depends(get_db)
):
    service = SubjectService(db)
    return service.get_subject_by_id(
        subject_id
    )
