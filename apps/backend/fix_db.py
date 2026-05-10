from sqlalchemy import text
from app.database.database import engine

def fix_database():
    try:
        with engine.connect() as conn:
            conn.execute(text('ALTER TABLE quizzes ALTER COLUMN lesson_id DROP NOT NULL'))
            conn.commit()
            print("✅ Database column 'lesson_id' is now nullable!")
    except Exception as e:
        print(f"❌ Error updating database: {e}")

if __name__ == "__main__":
    fix_database()
