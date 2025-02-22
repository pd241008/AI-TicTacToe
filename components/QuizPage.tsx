import React, { useState, useEffect, ChangeEvent } from "react";
import ScorePage from "./ScorePage"; // Importing ScorePage

interface Question {
  id: number;
  question: string;
  answers: {
    answer_a: string | null;
    answer_b: string | null;
    answer_c: string | null;
    answer_d: string | null;
    answer_e?: string | null;
    answer_f?: string | null;
  };
  correct_answers?: {
    answer_a_correct: string;
    answer_b_correct: string;
    answer_c_correct: string;
    answer_d_correct: string;
    answer_e_correct?: string;
    answer_f_correct?: string;
  };
}

const API_KEY = "DdbRnd67HTrkr0u44bKsAs1eIhqDUjB6CYmZSBZ4";
const API_URL = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=code&difficulty=Medium&limit=15`;

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchQuestions = async (): Promise<void> => {
      try {
        const res = await fetch(API_URL);
        const data: Question[] = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions", error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    setSelectedOptions({});
  }, [currentQuestionIndex]);

  const handleAnswerClick = (selectedAnswer: string): void => {
    const currentQuestion: Question = questions[currentQuestionIndex];
    const answerKey: string | undefined = Object.entries(
      currentQuestion.answers
    ).find(([, answer]) => answer === selectedAnswer)?.[0];

    if (
      answerKey &&
      currentQuestion.correct_answers &&
      currentQuestion.correct_answers[
        `${answerKey}_correct` as keyof typeof currentQuestion.correct_answers
      ] === "true"
    ) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizCompleted(false);
  };

  if (questions.length === 0) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex justify-center items-center p-4">
      {isQuizCompleted ? (
        <ScorePage
          score={score}
          total={questions.length}
          restartQuiz={restartQuiz}
        />
      ) : (
        <div className="w-full max-w-md min-h-40 p-6 bg-white shadow-lg rounded-xl flex flex-col items-start text-left dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold">
            {questions[currentQuestionIndex].question}
          </h2>
          {Object.entries(questions[currentQuestionIndex].answers)
            .filter(([, answer]) => answer !== null)
            .map(([key, answer]) => (
              <label
                key={key}
                className="mb-2 flex items-center cursor-pointer w-full"
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedOptions[key] || false}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const isChecked: boolean = e.target.checked;
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [key]: isChecked,
                    }));
                    if (isChecked && answer) {
                      handleAnswerClick(answer);
                    }
                  }}
                />
                {answer}
              </label>
            ))}
          <button
            onClick={nextQuestion}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full"
          >
            {currentQuestionIndex < questions.length - 1
              ? "Next Question"
              : "Check Score"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
