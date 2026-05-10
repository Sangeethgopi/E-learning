import psycopg2
import uuid

# Use localhost:5432 because we are running outside Docker
conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/elearning_db")
cur = conn.cursor()

user_id = str(uuid.uuid4())
username = "John"
email = "john@gmail.com"
password_hash = "$2b$12$AayArI07Xg1bc3y6VDiPNusYVmPZCgyy95EB5gLxfbYDtrbRGBKYK"

cur.execute(
    "INSERT INTO users (id, username, email, password_hash, xp_points, streak_count, role) VALUES (%s, %s, %s, %s, %s, %s, %s)",
    (user_id, username, email, password_hash, 100, 5, 'student')
)

conn.commit()
cur.close()
conn.close()
print(f"Created user {username} with ID {user_id}")
