import React, { useState, useEffect, useCallback } from "react";
import { RotateCcw, Trophy, Users, Gamepad2 } from "lucide-react";

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
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

const TicTacToe: React.FC = () => {
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

  const handleClick = useCallback(
    (index: number): void => {
      if (!gameActive || board[index] !== "") return;

      const updatedBoard = [...board];
      updatedBoard[index] = currentPlayer;
      setBoard(updatedBoard);

      const winner = checkWinner(updatedBoard);
      if (!winner) {
        setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
      }
    },
    [board, currentPlayer, gameActive]
  );

  const checkWinner = useCallback((updatedBoard: string[]): boolean => {
    // Check for winning condition
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

        // Update stats
        setGameStats((prev) => ({
          ...prev,
          [updatedBoard[a] === "X" ? "xWins" : "oWins"]:
            prev[updatedBoard[a] === "X" ? "xWins" : "oWins"] + 1,
          totalGames: prev.totalGames + 1,
        }));

        return true;
      }
    }

    // Check for draw
    if (!updatedBoard.includes("")) {
      setGameActive(false);
      setGameResult("draw");
      setShowCelebration(true);

      // Update stats
      setGameStats((prev) => ({
        ...prev,
        draws: prev.draws + 1,
        totalGames: prev.totalGames + 1,
      }));

      return true;
    }

    return false;
  }, []);

  const restartGame = useCallback((): void => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setGameActive(true);
    setWinningLine(null);
    setShowCelebration(false);
    setGameResult(null);
  }, []);

  const resetAllStats = useCallback((): void => {
    setGameStats({
      xWins: 0,
      oWins: 0,
      draws: 0,
      totalGames: 0,
    });
    restartGame();
  }, [restartGame]);

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const getCellClassName = (index: number): string => {
    const baseClasses =
      "relative w-20 h-20 sm:w-24 sm:h-24 text-2xl sm:text-3xl font-bold transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg";

    const isEmpty = board[index] === "";
    const isWinning = winningLine?.indices.includes(index);
    const isX = board[index] === "X";
    const isO = board[index] === "O";

    let classes = baseClasses;

    if (isEmpty && gameActive) {
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
      if (winningLine) return `Player ${winningLine.player} wins! 🎉`;
    }
    return `Player ${currentPlayer}'s turn`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

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
          </div>
          <p className="text-white/80 text-lg">Challenge your opponent!</p>
        </div>

        {/* Game Stats */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <h3 className="text-white font-semibold">Game Statistics</h3>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-emerald-500/20 rounded-lg p-2">
              <div className="text-emerald-200 text-xs font-medium">
                Player X
              </div>
              <div className="text-white font-bold text-lg">
                {gameStats.xWins}
              </div>
            </div>
            <div className="bg-rose-500/20 rounded-lg p-2">
              <div className="text-rose-200 text-xs font-medium">Player O</div>
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

        {/* Game Board Container */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
          {/* Current Player Indicator */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-5 h-5 text-white/80" />
            <div
              className={`text-lg font-semibold transition-all duration-300 ${
                gameActive
                  ? currentPlayer === "X"
                    ? "text-emerald-300"
                    : "text-rose-300"
                  : "text-white"
              }`}
            >
              {getStatusMessage()}
            </div>
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-3 gap-3 mb-6 justify-items-center">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className={getCellClassName(index)}
                disabled={!gameActive || cell !== ""}
                aria-label={`Cell ${index + 1}, ${cell || "empty"}`}
              >
                <span
                  className={`transition-all duration-300 ${
                    cell ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  } ${cell === "X" ? "text-emerald-700" : "text-rose-700"}`}
                >
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
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </button>
            <button
              onClick={resetAllStats}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400/50 backdrop-blur-sm border border-red-400/30"
            >
              <Trophy className="w-4 h-4" />
              Reset Stats
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/60 text-sm">Built with React & TypeScript</p>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
