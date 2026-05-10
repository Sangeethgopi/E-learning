from app.repositories.course_repository import CourseRepository
from app.schemas.course import CourseCreate
import uuid

def test_create_course_repository(db_session):
    repo = CourseRepository(db_session)
    # We need a subject first because of foreign key
    # But in SQLite/Mock we might bypass or need to create it.
    # I'll check if Course needs a real subject_id.
    
    # Create a course data
    subject_id = str(uuid.uuid4())
    course_data = CourseCreate(
        subject_id=subject_id,
        title="Test Course",
        description="A test course description",
        difficulty="beginner"
    )
    
    course = repo.create_course(course_data)
    assert course.id is not None
    assert course.title == "Test Course"
    
def test_get_all_courses_repository(db_session):
    repo = CourseRepository(db_session)
    courses = repo.get_all_courses()
    assert isinstance(courses, list)
