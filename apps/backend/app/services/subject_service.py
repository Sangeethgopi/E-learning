from sqlalchemy.orm import Session
from app.repositories.subject_repository import (
    SubjectRepository)
from app.schemas.subject import SubjectCreate


class SubjectService:
    def __init__(self, db: Session):
        self.repository = SubjectRepository(db)

    def create_subject(
        self,
        subject_data: SubjectCreate
    ):
        return self.repository.create_subject(
            subject_data
        )

    def get_all_subjects(self, skip: int = 0, limit: int = 10, search: str | None = None):
        return self.repository.get_all_subjects(skip=skip, limit=limit, search=search)

    def get_subject_by_id(
        self,
        subject_id
    ):
        return self.repository.get_subject_by_id(
            subject_id
        )
