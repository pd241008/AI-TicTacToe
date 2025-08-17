"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RotateCcw, Trophy, Users, Gamepad2, Bot } from "lucide-react";
import axios from "axios";

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
  totalGames: number;
}
interface WinningLine {
  indices: number[];
  player: "X" | "O";
}

const winningConditions: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const TicTacToeVsComputer: React.FC = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [gameActive, setGameActive] = useState<boolean>(true);
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    xWins: 0,
    oWins: 0,
    draws: 0,
    totalGames: 0,
  });
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<"win" | "draw" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const checkWinner = useCallback((updatedBoard: string[]): boolean => {
    for (const condition of winningConditions) {
      const [a, b, c] = condition;
      if (
        updatedBoard[a] &&
        updatedBoard[a] === updatedBoard[b] &&
        updatedBoard[a] === updatedBoard[c]
      ) {
        setWinningLine({
          indices: condition,
          player: updatedBoard[a] as "X" | "O",
        });
        setGameActive(false);
        setGameResult("win");
        setShowCelebration(true);
        setGameStats((prev) => ({
          ...prev,
          [updatedBoard[a] === "X" ? "xWins" : "oWins"]:
            prev[updatedBoard[a] === "X" ? "xWins" : "oWins"] + 1,
          totalGames: prev.totalGames + 1,
        }));
        return true;
      }
    }
    if (!updatedBoard.includes("")) {
      setGameActive(false);
      setGameResult("draw");
      setShowCelebration(true);
      setGameStats((prev) => ({
        ...prev,
        draws: prev.draws + 1,
        totalGames: prev.totalGames + 1,
      }));
      return true;
    }
    return false;
  }, []);

  const handleClick = useCallback(
    async (index: number): Promise<void> => {
      if (!gameActive || board[index] !== "" || loading) return;

      const updatedBoard = [...board];
      updatedBoard[index] = "X";
      setBoard(updatedBoard);

      if (checkWinner(updatedBoard)) return;

      setCurrentPlayer("O");
      setLoading(true);

      try {
        const response = await axios.post("/api/tictactoe-move", {
          board: updatedBoard,
          player: "O",
        });

        const computerMove = response.data.move;

        if (
          typeof computerMove === "number" &&
          updatedBoard[computerMove] === ""
        ) {
          updatedBoard[computerMove] = "O";
          setTimeout(() => {
            setBoard([...updatedBoard]);
            if (!checkWinner(updatedBoard)) {
              setCurrentPlayer("X");
            }
            setLoading(false);
          }, 500);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("API error:", error);
        setLoading(false);
      }
    },
    [board, gameActive, checkWinner, loading]
  );

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const restartGame = useCallback(() => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setGameActive(true);
    setWinningLine(null);
    setShowCelebration(false);
    setGameResult(null);
    setLoading(false);
  }, []);

  const resetAllStats = useCallback(() => {
    setGameStats({
      xWins: 0,
      oWins: 0,
      draws: 0,
      totalGames: 0,
    });
    restartGame();
  }, [restartGame]);

  const getCellClassName = (index: number): string => {
    const base =
      "relative w-20 h-20 sm:w-24 sm:h-24 text-2xl sm:text-3xl font-bold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg";
    const isWinning = winningLine?.indices.includes(index);
    const isX = board[index] === "X";
    const isO = board[index] === "O";

    let classes = base;

    if (board[index] === "" && gameActive && !loading) {
      classes +=
        " bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 hover:border-white/50 cursor-pointer";
    } else {
      classes += " border-2 cursor-not-allowed";
    }

    if (isWinning) {
      classes += isX
        ? " bg-emerald-400/80 border-emerald-500 text-emerald-900 animate-pulse"
        : " bg-rose-400/80 border-rose-500 text-rose-900 animate-pulse";
    } else if (isX) {
      classes += " bg-emerald-100/80 border-emerald-300 text-emerald-700";
    } else if (isO) {
      classes += " bg-rose-100/80 border-rose-300 text-rose-700";
    }

    return classes;
  };

  const getStatusMessage = (): string => {
    if (!gameActive) {
      if (gameResult === "draw") return "It's a draw! 🤝";
      if (winningLine)
        return `Player ${
          winningLine.player === "X" ? "You" : "Computer"
        } wins! 🎉`;
    }
    return currentPlayer === "X"
      ? "Your turn"
      : loading
      ? "Computer is thinking..."
      : "Computer's turn";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 relative overflow-hidden">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl sm:text-8xl animate-bounce">
            {gameResult === "win" ? "🎉" : "🤝"}
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bold text-white">Tic Tac Toe</h1>
            <Bot className="w-8 h-8 text-rose-200" />
          </div>
          <p className="text-white/80 text-lg">Play against the computer!</p>
        </div>

        {/* Game Stats */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <h3 className="text-white font-semibold">Game Statistics</h3>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-emerald-500/20 rounded-lg p-2">
              <div className="text-emerald-200 text-xs font-medium">You</div>
              <div className="text-white font-bold text-lg">
                {gameStats.xWins}
              </div>
            </div>
            <div className="bg-rose-500/20 rounded-lg p-2">
              <div className="text-rose-200 text-xs font-medium">Computer</div>
              <div className="text-white font-bold text-lg">
                {gameStats.oWins}
              </div>
            </div>
            <div className="bg-yellow-500/20 rounded-lg p-2">
              <div className="text-yellow-200 text-xs font-medium">Draws</div>
              <div className="text-white font-bold text-lg">
                {gameStats.draws}
              </div>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-2">
              <div className="text-blue-200 text-xs font-medium">Total</div>
              <div className="text-white font-bold text-lg">
                {gameStats.totalGames}
              </div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-5 h-5 text-white/80" />
            <div
              className={`text-lg font-semibold transition-all duration-300 ${
                !gameActive
                  ? "text-white"
                  : currentPlayer === "X"
                  ? "text-emerald-300"
                  : "text-rose-300"
              }`}>
              {getStatusMessage()}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 justify-items-center">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className={getCellClassName(index)}
                disabled={
                  !gameActive ||
                  cell !== "" ||
                  (currentPlayer === "O" && !loading)
                }
                aria-label={`Cell ${index + 1}, ${cell || "empty"}`}>
                <span
                  className={`transition-all duration-300 ${
                    cell ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  } ${cell === "X" ? "text-emerald-700" : "text-rose-700"}`}>
                  {cell}
                </span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={restartGame}
              className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              disabled={loading}>
              <RotateCcw className="w-4 h-4" />
              New Game
            </button>
            <button
              onClick={resetAllStats}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400/50 backdrop-blur-sm border border-red-400/30"
              disabled={loading}>
              <Trophy className="w-4 h-4" />
              Reset Stats
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-white/60 text-sm">
            Built with Next.js & TypeScript
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicTacToeVsComputer;
