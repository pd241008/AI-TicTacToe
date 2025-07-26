"use client";
import React, { useState } from "react";
import { Users, Bot, Gamepad2, Star, ArrowRight } from "lucide-react";
import TicTacToe from "@/components/TickTackToe";
import ComputerGames from "@/components/ComputerGames";

type GameMode = "landing" | "play-friend" | "play-computer";

const LandingPage: React.FC = () => {
  const [mode, setMode] = useState<GameMode>("landing");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-white/10 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/10 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">TicTacToe Pro</h1>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium">
                Premium Gaming Experience
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl mx-auto text-center w-full">
            {mode === "landing" && (
              <>
                {/* Hero Section */}
                <div className="mb-16">
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    The Ultimate
                    <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                      {" "}
                      Tic Tac Toe
                    </span>
                    Experience
                  </h2>

                  <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Challenge your friends or test your skills against our
                    intelligent AI. Beautiful design meets classic gameplay with
                    modern features.
                  </p>
                </div>

                {/* Game Mode Selection */}
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  {/* Play with Friend */}
                  <button
                    onClick={() => setMode("play-friend")}
                    className="group text-left w-full"
                    type="button"
                  >
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                          Play with Friend
                        </h3>
                        <p className="text-white/70 leading-relaxed">
                          Challenge a friend in classic turn-based gameplay.
                          Perfect for competitive matches and friendly
                          rivalries.
                        </p>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-white/80">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span className="text-sm">Local multiplayer</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span className="text-sm">Score tracking</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span className="text-sm">Win celebrations</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-white group-hover:text-emerald-300 transition-colors duration-300">
                        <span className="font-semibold">Start Playing</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </button>

                  {/* Play with Computer */}
                  <button
                    onClick={() => setMode("play-computer")}
                    className="group text-left w-full"
                    type="button"
                  >
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                          <Bot className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                          Play vs Computer
                        </h3>
                        <p className="text-white/70 leading-relaxed">
                          Test your skills against our intelligent AI. Multiple
                          difficulty levels to challenge players of all skill
                          levels.
                        </p>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-white/80">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-sm">Smart AI opponent</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-sm">Multiple difficulties</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-sm">Performance stats</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-white group-hover:text-purple-300 transition-colors duration-300">
                        <span className="font-semibold">Challenge AI</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )}

            {mode === "play-friend" && (
              <div>
                <button
                  className="mb-6 text-white underline hover:text-yellow-400"
                  onClick={() => setMode("landing")}
                >
                  ← Back to Home
                </button>
                <TicTacToe />
              </div>
            )}

            {mode === "play-computer" && (
              <div>
                <button
                  className="mb-6 text-white underline hover:text-yellow-400"
                  onClick={() => setMode("landing")}
                >
                  ← Back to Home
                </button>
                <ComputerGames />
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-white/60 text-sm">
              Built with Nextjs, TypeScript & Tailwind CSS • Powered by Modern
              Web Technologies
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
