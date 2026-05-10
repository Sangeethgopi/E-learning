from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.subjects import router as subjects_router
from app.api.courses import router as courses_router
from app.api.questions import router as questions_router
from app.api.quiz_attempts import router as quiz_attempts_router
from app.api.pdf import router as pdf_router
from app.api.realtime import router as realtime_router
from app.api.matchmaking import router as matchmaking_router
from app.api.payments import router as payments_router
from app.api.webhooks import router as webhooks_router

app = FastAPI(
    title="AI E-Learning Platform",
    description="SaaS-grade AI Educational Ecosystem",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Vercel deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers with a Single Central Prefix
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(subjects_router, prefix="/api/v1")
app.include_router(courses_router, prefix="/api/v1")
app.include_router(questions_router, prefix="/api/v1")
app.include_router(quiz_attempts_router, prefix="/api/v1")
app.include_router(pdf_router, prefix="/api/v1")
app.include_router(realtime_router, prefix="/api/v1")
app.include_router(matchmaking_router, prefix="/api/v1")
app.include_router(payments_router, prefix="/api/v1")
app.include_router(webhooks_router, prefix="/api/v1")


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "platform": "AI E-Learning Platform"
    }
