from sqlalchemy.orm import Session

from app.models.question import Question
from app.models.quiz_attempt import QuizAttempt
from app.models.quiz_answer import QuizAnswer
from app.models.user import User
from app.services.xp_service import XPService


class QuizEngineService:

    def __init__(self, db: Session):
        self.db = db

    def submit_quiz(
        self,
        user_id,
        quiz_id,
        answers
    ):
        questions = self.db.query(Question).filter(
            Question.quiz_id == quiz_id
        ).all()

        total_questions = len(questions)

        score = 0

        attempt = QuizAttempt(
            user_id=user_id,
            quiz_id=quiz_id,
            total_questions=total_questions,
            completed=True
        )

        self.db.add(attempt)
        self.db.flush()

        for question in questions:

            selected_answer = answers.get(
                str(question.id)
            )

            is_correct = (
                selected_answer ==
                question.correct_answer
            )

            if is_correct:
                score += 1

            answer = QuizAnswer(
                attempt_id=attempt.id,
                question_id=question.id,
                selected_answer=selected_answer,
                is_correct=is_correct
            )

            self.db.add(answer)

        attempt.score = score
        
        # Calculate and award XP
        xp_earned = XPService.calculate_xp(score, total_questions)
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            user.xp_points += xp_earned

        self.db.commit()

        return {
            "score": score,
            "total_questions": total_questions,
            "percentage": (
                score / total_questions
            ) * 100 if total_questions > 0 else 0,
            "xp_earned": xp_earned
        }
