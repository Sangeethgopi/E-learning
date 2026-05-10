"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import BattleRoom from "@/components/BattleRoom";
import axios from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function BattlePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quiz_id");
  const { user } = useAuthStore();
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Fallback to a mock quiz if the specific one isn't found
        // or if we just want to test the UI immediately.
        if (quizId) {
            const response = await axios.get(`questions/quiz/${quizId}`);
            setQuizData({
                questions: response.data
            });
        } else {
            // Mock data for immediate testing
            setQuizData({
                questions: [
                    {
                        question_text: "What is the primary purpose of a Hadoop NameNode?",
                        options: [
                            { option_text: "To store data blocks", is_correct: false },
                            { option_text: "To manage the filesystem namespace", is_correct: true },
                            { option_text: "To execute Map tasks", is_correct: false },
                            { option_text: "To manage network traffic", is_correct: false }
                        ]
                    },
                    {
                        question_text: "In PySpark, which operation is a transformation?",
                        options: [
                            { option_text: "collect()", is_correct: false },
                            { option_text: "map()", is_correct: true },
                            { option_text: "count()", is_correct: false },
                            { option_text: "first()", is_correct: false }
                        ]
                    }
                ]
            });
        }
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading || !user) return <div className="flex items-center justify-center h-screen">Preparing Battle Arena...</div>;

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <BattleRoom 
        roomId={id as string} 
        userId={user.id} 
        username={user.username}
        quizData={quizData}
      />
    </div>
  );
}
