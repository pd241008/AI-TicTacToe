import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import QuizPage from "./components/QuizPage";
import ScorePage from "./components/ScorePage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route
          path="/score"
          element={
            <ScorePage
              score={0}
              total={0}
              restartQuiz={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
