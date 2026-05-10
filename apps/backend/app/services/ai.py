import asyncio
from groq import AsyncGroq
from app.core.config import settings


class AIService:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.model = "llama-3.3-70b-versatile"

    async def generate_response(
        self,
        system_prompt: str,
        user_prompt: str,
        json_mode: bool = False
    ) -> str:
        params = {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "model": self.model,
        }
        # NOTE: Do NOT use json_mode=True — Groq's strict JSON validation
        # fails when the model produces slightly malformed JSON, crashing the
        # entire request with a 400. Instead we ask for JSON in the prompt
        # and parse it ourselves with error recovery in QuestionParser.

        chat_completion = await self.client.chat.completions.create(**params)
        return chat_completion.choices[0].message.content


ai_service = AIService()
