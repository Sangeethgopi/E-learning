from sqlalchemy.orm import Session
from app.repositories.course_repository import (
    CourseRepository)
from app.schemas.course import CourseCreate


class CourseService:
    def __init__(self, db: Session):
        self.repository = CourseRepository(db)

    def create_course(
        self,
        course_data: CourseCreate
    ):
        return self.repository.create_course(
            course_data
        )

    def get_all_courses(self, skip: int = 0, limit: int = 10, search: str | None = None):
        return self.repository.get_all_courses(skip=skip, limit=limit, search=search)

    def get_course_by_id(
        self,
        course_id
    ):
        return self.repository.get_course_by_id(
            course_id
        )
