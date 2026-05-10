from sqlalchemy.orm import Session
from app.models.subject import Subject
from app.schemas.subject import SubjectCreate


class SubjectRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_subject(
        self,
        subject_data: SubjectCreate
    ):
        subject = Subject(
            name=subject_data.name,
            description=subject_data.description,
            icon=subject_data.icon
        )
        self.db.add(subject)
        self.db.commit()
        self.db.refresh(subject)
        return subject

    def get_all_subjects(self, skip: int = 0, limit: int = 10, search: str | None = None):
        query = self.db.query(Subject)
        if search:
            query = query.filter(Subject.name.ilike(f"%{search}%"))
        return query.offset(skip).limit(limit).all()

    def get_subject_by_id(
        self,
        subject_id
    ):
        return self.db.query(Subject).filter(
            Subject.id == subject_id
        ).first()
