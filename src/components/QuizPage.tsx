import React, { useState, useEffect, ChangeEvent } from "react";

// Define the structure of a question based on the QuizAPI response.
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

const QuizComponent: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  // State to track which options are selected. The key is the answer key (like "answer_a") and the value is a boolean.
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: boolean;
  }>({});

  // Fetch questions from the API when the component mounts.
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

  // Reset the selected checkboxes whenever the current question changes.
  useEffect(() => {
    setSelectedOptions({});
  }, [currentQuestionIndex]);

  // Handler to process answer selection.
  const handleAnswerClick = (selectedAnswer: string): void => {
    const currentQuestion: Question = questions[currentQuestionIndex];
    // Find the key for the selected answer, e.g., "answer_a", "answer_b", etc.
    const answerKey: string | undefined = Object.entries(
      currentQuestion.answers
    ).find(([, answer]) => answer === selectedAnswer)?.[0];

    // Check if the selected answer is correct.
    if (
      answerKey &&
      currentQuestion.correct_answers &&
      currentQuestion.correct_answers[
        `${answerKey}_correct` as keyof typeof currentQuestion.correct_answers
      ] === "true"
    ) {
      setScore((prevScore) => prevScore + 1);
    }

    // Move to the next question or mark the quiz as complete.
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  // When questions haven't loaded yet, show a loading indicator.
  if (questions.length === 0) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex justify-center items-center mx-auto max-w-sm max-h-96 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
      {isQuizCompleted ? (
        <h2 className="text-center">
          Your Score: {score} / {questions.length}
        </h2>
      ) : (
        <div className="flex flex-col text-left rtl:text-right text-black-500 dark:text-black-400">
          <h2 className="mb-4">{questions[currentQuestionIndex].question}</h2>
          {Object.entries(questions[currentQuestionIndex].answers)
            .filter(([_, answer]) => answer !== null)
            .map(([key, answer]) => (
              <label
                key={key}
                className="mb-2 flex items-center cursor-pointer"
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
                    // Process the answer only when the checkbox is checked.
                    if (isChecked && answer) {
                      handleAnswerClick(answer);
                    }
                  }}
                />
                {answer}
              </label>
            ))}
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
