import json
import re
import logging

logger = logging.getLogger(__name__)


class QuestionParser:

    @staticmethod
    def parse_questions(ai_response: str) -> list:
        """
        Robustly parse questions from an AI response string.
        Handles:
        - Clean JSON objects/arrays
        - JSON embedded inside markdown code blocks
        - Slightly malformed JSON (uses regex extraction as fallback)
        """
        if not ai_response:
            return []

        # Step 1: Strip markdown code fences if present
        cleaned = re.sub(r"```(?:json)?", "", ai_response).strip()

        # Step 2: Try direct JSON parse
        try:
            data = json.loads(cleaned)
            return QuestionParser._extract_list(data)
        except json.JSONDecodeError:
            pass

        # Step 3: Try to find a JSON object or array anywhere in the string
        # This handles cases where the model adds extra text around the JSON
        for pattern in [r'\{.*\}', r'\[.*\]']:
            match = re.search(pattern, cleaned, re.DOTALL)
            if match:
                try:
                    data = json.loads(match.group())
                    result = QuestionParser._extract_list(data)
                    if result:
                        return result
                except json.JSONDecodeError:
                    pass

        logger.error(f"Could not parse questions from AI response: {ai_response[:200]}")
        return []

    @staticmethod
    def _extract_list(data) -> list:
        """Extract the questions list from a parsed JSON structure."""
        if isinstance(data, list):
            return data
        if isinstance(data, dict):
            for key in ["questions", "items", "data", "quiz", "results"]:
                if key in data and isinstance(data[key], list):
                    return data[key]
        return []
