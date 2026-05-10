from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.course import CourseCreate
from app.schemas.course import CourseResponse
from app.services.course_service import (
    CourseService)

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)


@router.post(
    "/",
    response_model=CourseResponse
)
def create_course(
    course_data: CourseCreate,
    db: Session = Depends(get_db)
):
    service = CourseService(db)
    return service.create_course(
        course_data
    )


@router.get(
    "/",
    response_model=list[CourseResponse]
)
def get_courses(
    skip: int = 0,
    limit: int = 10,
    search: str | None = None,
    db: Session = Depends(get_db)
):
    service = CourseService(db)
    return service.get_all_courses(skip=skip, limit=limit, search=search)


@router.get(
    "/{course_id}",
    response_model=CourseResponse
)
def get_course(
    course_id,
    db: Session = Depends(get_db)
):
    service = CourseService(db)
    return service.get_course_by_id(
        course_id
    )
