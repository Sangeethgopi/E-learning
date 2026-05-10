class XPService:

    @staticmethod
    def calculate_xp(
        score,
        total_questions
    ):
        if total_questions == 0:
            return 0
            
        percentage = (
            score / total_questions
        ) * 100

        if percentage >= 90:
            return 50

        if percentage >= 70:
            return 30

        return 10
