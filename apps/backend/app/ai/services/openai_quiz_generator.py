from openai import OpenAI

from app.core.config import settings

client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)


class OpenAIQuizGenerator:

    @staticmethod
    def generate_mcqs(
        text_chunk: str
    ):

        prompt = f'''
Generate 5 multiple choice questions
from the following content.

Rules:
- Return valid JSON array of objects
- Each object must include:
  "question"
  "options" (array of 4 strings)
  "correct_answer" (one of the options)
  "explanation"

Content:
{text_chunk}
'''

        response = client.chat.completions.create(
            model="gpt-4o-mini",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.3,
            response_format={ "type": "json_object" }
        )

        return response.choices[0].message.content
