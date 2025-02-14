import { useState, useEffect } from "react";

type QuestionType = {
  question: string;
  answers: { [key: string]: string | null };
  correct_answer: string;
};

export default function QuizApp() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const API_KEY = "DdbRnd67HTrkr0u44bKsAs1eIhqDUjB6CYmZSBZ4"; // Replace with your actual API key
  const API_URL = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=code&difficulty=Medium&limit=15`;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        if (!data || data.length === 0) {
          throw new Error("No questions received from API");
        }
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerClick = (selectedAnswer: string) => {
    const correctAnswer = questions[currentQuestionIndex].correct_answer;
    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (questions.length === 0) return <h2>No questions available</h2>;

  return (
    <div className="justify-center content-overflow">
      {isQuizCompleted ? (
        <h2>
          Your Score: {score} / {questions.length}
        </h2>
      ) : (
        <div>
          <h2>{questions[currentQuestionIndex].question}</h2>
          {Object.entries(questions[currentQuestionIndex].answers)
            .filter(([_, value]) => value !== null) // Remove null answers
            .map(([key, value]) => (
              <button key={key} onClick={() => handleAnswerClick(value!)}>
                {value}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
