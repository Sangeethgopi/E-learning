from sqlalchemy.orm import Session
from app.models.course import Course
from app.schemas.course import CourseCreate


class CourseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_course(
        self,
        course_data: CourseCreate
    ):
        course = Course(
            subject_id=course_data.subject_id,
            title=course_data.title,
            description=course_data.description,
            difficulty=course_data.difficulty
        )
        self.db.add(course)
        self.db.commit()
        self.db.refresh(course)
        return course

    def get_all_courses(self, skip: int = 0, limit: int = 10, search: str | None = None):
        query = self.db.query(Course)
        if search:
            query = query.filter(Course.title.ilike(f"%{search}%"))
        return query.offset(skip).limit(limit).all()

    def get_course_by_id(
        self,
        course_id
    ):
        return self.db.query(Course).filter(
            Course.id == course_id
        ).first()
