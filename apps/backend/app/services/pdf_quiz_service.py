import os
import uuid
import logging

from sqlalchemy.orm import Session

from app.ai.parsers.question_parser import (
    QuestionParser
)

from app.services.ai import ai_service

from app.ai.services.pdf_extractor import (
    PDFExtractor
)

from app.ai.services.text_chunker import (
    TextChunker
)

from app.models.quiz import Quiz
from app.models.question import Question
from app.models.question_option import (
    QuestionOption
)


class PDFQuizService:

    def __init__(self, db: Session):
        self.db = db
        self.logger = logging.getLogger(__name__)

    async def process_pdf(
        self,
        file_path: str,
        lesson_id: str
    ):
        from app.models.lesson import Lesson
        
        # Validate lesson_id
        lesson = None
        if lesson_id and lesson_id != "standalone":
            try:
                # Only query if it looks like a UUID to avoid DB error
                import uuid as uuid_pkg
                uuid_pkg.UUID(lesson_id)
                lesson = self.db.query(Lesson).filter(Lesson.id == lesson_id).first()
            except (ValueError, Exception):
                self.logger.warning(f"Invalid lesson_id format: {lesson_id}")
                pass

        extracted_text = (
            PDFExtractor.extract_text(
                file_path
            )
        )
        self.logger.warning(f"Extracted text length: {len(extracted_text)}")

        chunks = TextChunker.chunk_text(
            extracted_text
        )
        self.logger.warning(f"Number of chunks: {len(chunks)}")

        quiz = Quiz(
            lesson_id=lesson.id if lesson else None,
            title="AI Generated Quiz",
            generated_from_pdf=True
        )

        self.db.add(quiz)
        self.db.flush()

        total_questions = 0

        for chunk in chunks:

            system_prompt = (
                "You are a quiz generator. Given the text below, generate exactly 5 multiple choice questions. "
                "Respond ONLY with valid JSON in this exact format, no extra text:\n"
                '{"questions": [{"question": "...", "options": ["A", "B", "C", "D"], "correct_answer": "A", "explanation": "..."}]}'
            )
            
            ai_response = await ai_service.generate_response(
                system_prompt=system_prompt,
                user_prompt=chunk,
                json_mode=False
            )
            
            self.logger.warning(f"AI Response: {ai_response}")

            questions = (
                QuestionParser
                .parse_questions(ai_response)
            )

            for item in questions:

                question = Question(
                    quiz_id=quiz.id,
                    question_text=item[
                        "question"
                    ],
                    correct_answer=item[
                        "correct_answer"
                    ],
                    explanation=item.get(
                        "explanation"
                    )
                )

                self.db.add(question)
                self.db.flush()

                for option in item[
                    "options"
                ]:

                    option_model = (
                        QuestionOption(
                            question_id=question.id,
                            option_text=option,
                            is_correct=(
                                option ==
                                item[
                                    "correct_answer"
                                ]
                            )
                        )
                    )

                    self.db.add(option_model)

                total_questions += 1

        self.db.commit()

        # Fetch questions and options to return them
        from app.models.question import Question
        from app.models.question_option import QuestionOption

        generated_questions_data = []
        db_questions = self.db.query(Question).filter(Question.quiz_id == quiz.id).all()
        
        for q in db_questions:
            options = self.db.query(QuestionOption).filter(QuestionOption.question_id == q.id).all()
            generated_questions_data.append({
                "question": q.question_text,
                "correct_answer": q.correct_answer,
                "explanation": q.explanation,
                "options": [opt.option_text for opt in options]
            })

        return {
            "quiz_id": str(quiz.id),
            "generated_count": total_questions,
            "questions": generated_questions_data
        }
