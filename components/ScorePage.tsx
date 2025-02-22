import React from "react";

interface ScorePageProps {
  score: number;
  total: number;
  restartQuiz: () => void;
}

const ScorePage: React.FC<ScorePageProps> = ({ score, total, restartQuiz }) => {
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <h2 className="text-center text-2xl font-bold">
        Your Score: {score} / {total}
      </h2>
      <button
        onClick={restartQuiz}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Restart Quiz
      </button>
    </div>
  );
};

export default ScorePage;
