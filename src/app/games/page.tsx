"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Gamepad2, Trophy, Star, RefreshCw, Brain, Calculator, X, Circle, Play } from "lucide-react";

// --- Memory Game Types & Data ---
interface CardItem {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}
const EMOJIS = ["🍕", "🚀", "🦄", "🎸", "🎮", "🍦", "🐉", "💎"];

// --- Quick Math Types ---
interface MathProblem {
    question: string;
    answer: number;
}

// --- Tic-Tac-Toe Types ---
type Player = "X" | "O" | null;

export default function GamesPage() {
    const [points, setPoints] = useState(0);
    const [activeGame, setActiveGame] = useState<"memory" | "math" | "tictactoe">("memory");

    // --- Memory Game State ---
    const [cards, setCards] = useState<CardItem[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [memoryWon, setMemoryWon] = useState(false);

    // --- Quick Math State ---
    const [mathProblem, setMathProblem] = useState<MathProblem | null>(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [mathScore, setMathScore] = useState(0);
    const [mathTimer, setMathTimer] = useState(30);
    const [isMathPlaying, setIsMathPlaying] = useState(false);
    const [mathMessage, setMathMessage] = useState("");

    // --- Tic-Tac-Toe State ---
    const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true); // User is always X
    const [tttWinner, setTttWinner] = useState<Player | "Draw" | null>(null);

    // --- Shared Logic ---
    useEffect(() => {
        const savedPoints = localStorage.getItem("student_points");
        if (savedPoints) setPoints(parseInt(savedPoints));
    }, []);

    const updatePoints = (amount: number) => {
        const newPoints = points + amount;
        setPoints(newPoints);
        localStorage.setItem("student_points", newPoints.toString());
    };

    // --- Memory Game Logic ---
    const startMemoryGame = useCallback(() => {
        const shuffledEmojis = [...EMOJIS, ...EMOJIS]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji,
                isFlipped: false,
                isMatched: false,
            }));
        setCards(shuffledEmojis);
        setFlippedCards([]);
        setMoves(0);
        setMemoryWon(false);
    }, []);

    useEffect(() => {
        startMemoryGame();
    }, [startMemoryGame]);

    const handleCardClick = (id: number) => {
        if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

        const newCards = [...cards];
        newCards[id].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, id];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(moves + 1);
            if (cards[newFlipped[0]].emoji === cards[newFlipped[1]].emoji) {
                // Match
                newCards[newFlipped[0]].isMatched = true;
                newCards[newFlipped[1]].isMatched = true;
                setCards(newCards);
                setFlippedCards([]);
                updatePoints(10);

                if (newCards.every((card) => card.isMatched)) {
                    setMemoryWon(true);
                    updatePoints(50);
                }
            } else {
                // No match
                setTimeout(() => {
                    const resetCards = [...cards];
                    resetCards[newFlipped[0]].isFlipped = false;
                    resetCards[newFlipped[1]].isFlipped = false;
                    setCards(resetCards);
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    // --- Quick Math Logic ---
    const generateMathProblem = () => {
        const ops = ["+", "-", "*"];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a = Math.floor(Math.random() * 12) + 1;
        let b = Math.floor(Math.random() * 12) + 1;
        let question = "";
        let answer = 0;

        if (op === "+") {
            question = `${a} + ${b}`;
            answer = a + b;
        } else if (op === "-") {
            if (a < b) [a, b] = [b, a]; // Ensure positive result
            question = `${a} - ${b}`;
            answer = a - b;
        } else {
            a = Math.floor(Math.random() * 10) + 1; // Smaller numbers for multiplication
            b = Math.floor(Math.random() * 10) + 1;
            question = `${a} × ${b}`;
            answer = a * b;
        }
        setMathProblem({ question, answer });
    };

    const startMathGame = () => {
        setIsMathPlaying(true);
        setMathScore(0);
        setMathTimer(30);
        setMathMessage("");
        setUserAnswer("");
        generateMathProblem();
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isMathPlaying && mathTimer > 0) {
            interval = setInterval(() => {
                setMathTimer((prev) => prev - 1);
            }, 1000);
        } else if (mathTimer === 0 && isMathPlaying) {
            setIsMathPlaying(false);
            setMathMessage(`Time's up! Final Score: ${mathScore}`);
            updatePoints(mathScore * 5); // 5 points per correct answer
        }
        return () => clearInterval(interval);
    }, [isMathPlaying, mathTimer, mathScore]);

    const handleMathSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mathProblem) return;

        if (parseInt(userAnswer) === mathProblem.answer) {
            setMathScore(mathScore + 1);
            setMathMessage("Correct! +1");
            generateMathProblem();
            setUserAnswer("");
        } else {
            setMathMessage("Wrong! Try again.");
            setUserAnswer("");
        }
    };

    // --- Tic-Tac-Toe Logic ---
    const checkWinner = useCallback((squares: Player[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }, []);

    const handleSquareClick = (i: number) => {
        if (board[i] || tttWinner || !isXNext) return;

        const newBoard = [...board];
        newBoard[i] = "X";
        setBoard(newBoard);
        setIsXNext(false);

        const winner = checkWinner(newBoard);
        if (winner) {
            setTttWinner(winner);
            updatePoints(20); // Win points
        } else if (!newBoard.includes(null)) {
            setTttWinner("Draw");
            updatePoints(5); // Draw points
        } else {
            // AI Turn
            setTimeout(() => {
                const aiMove = getBestMove(newBoard);
                if (aiMove !== -1) {
                    newBoard[aiMove] = "O";
                    setBoard(newBoard);
                    setIsXNext(true);
                    const aiWinner = checkWinner(newBoard);
                    if (aiWinner) setTttWinner(aiWinner);
                    else if (!newBoard.includes(null)) {
                        setTttWinner("Draw");
                        updatePoints(5);
                    }
                }
            }, 500);
        }
    };

    const getBestMove = useCallback((currentBoard: Player[]) => {
        // Simple AI: 1. Win, 2. Block, 3. Random
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        // Helper to find empty spot in a line
        const findSpot = (player: Player) => {
            for (const [a, b, c] of lines) {
                if (currentBoard[a] === player && currentBoard[b] === player && !currentBoard[c]) return c;
                if (currentBoard[a] === player && currentBoard[c] === player && !currentBoard[b]) return b;
                if (currentBoard[b] === player && currentBoard[c] === player && !currentBoard[a]) return a;
            }
            return -1;
        };

        // 1. Try to win
        let move = findSpot("O");
        if (move !== -1) return move;

        // 2. Block X
        move = findSpot("X");
        if (move !== -1) return move;

        // 3. Center
        if (!currentBoard[4]) return 4;

        // 4. Random
        const emptyIndices = currentBoard.map((val, idx) => val === null ? idx : -1).filter(val => val !== -1);
        if (emptyIndices.length > 0) {
            // eslint-disable-next-line react-hooks/purity
            return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }
        return -1;
    }, []);

    const resetTicTacToe = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setTttWinner(null);
    };


    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <Sidebar />

            <main className="md:ml-64 ml-0 p-4 md:p-8 min-h-screen flex flex-col">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Gamepad2 className="w-8 h-8 text-violet-400" />
                            Games & Rewards
                        </h1>
                        <p className="text-slate-400">Earn points by playing games!</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-full">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Points</p>
                            <p className="text-2xl font-bold text-white">{points}</p>
                        </div>
                    </div>
                </header>

                {/* Game Selection Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveGame("memory")}
                        className={cn("px-6 py-3 rounded-xl font-bold transition-all", activeGame === "memory" ? "bg-violet-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800")}
                    >
                        Memory Match
                    </button>
                    <button
                        onClick={() => setActiveGame("math")}
                        className={cn("px-6 py-3 rounded-xl font-bold transition-all", activeGame === "math" ? "bg-violet-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800")}
                    >
                        Quick Math
                    </button>
                    <button
                        onClick={() => setActiveGame("tictactoe")}
                        className={cn("px-6 py-3 rounded-xl font-bold transition-all", activeGame === "tictactoe" ? "bg-violet-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800")}
                    >
                        Tic-Tac-Toe
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Game Area */}
                    <Card variant="neon" className="lg:col-span-2 p-6 min-h-[500px] flex flex-col">
                        {activeGame === "memory" && (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <Brain className="w-6 h-6 text-pink-400" />
                                        <h2 className="text-xl font-bold text-white">Memory Match</h2>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-slate-400 text-sm">Moves: {moves}</span>
                                        <button onClick={startMemoryGame} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                                            <RefreshCw className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                {memoryWon ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                                        <Trophy className="w-24 h-24 text-yellow-400 animate-bounce" />
                                        <div>
                                            <h3 className="text-3xl font-bold text-white mb-2">You Won!</h3>
                                            <p className="text-slate-400">You earned 50 bonus points!</p>
                                        </div>
                                        <button onClick={startMemoryGame} className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-all shadow-lg hover:scale-105">Play Again</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 gap-4 flex-1">
                                        {cards.map((card) => (
                                            <button
                                                key={card.id}
                                                onClick={() => handleCardClick(card.id)}
                                                disabled={card.isFlipped || card.isMatched}
                                                className={cn(
                                                    "relative w-full h-full min-h-[80px] rounded-xl text-4xl flex items-center justify-center transition-all duration-500 transform perspective-1000",
                                                    card.isFlipped || card.isMatched ? "bg-slate-800 rotate-y-180" : "bg-violet-600 hover:bg-violet-500 cursor-pointer"
                                                )}
                                            >
                                                <div className={cn("transition-all duration-500", card.isFlipped || card.isMatched ? "opacity-100 scale-100" : "opacity-0 scale-0")}>
                                                    {card.emoji}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {activeGame === "math" && (
                            <div className="flex flex-col items-center justify-center h-full space-y-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <Calculator className="w-8 h-8 text-blue-400" />
                                    <h2 className="text-2xl font-bold text-white">Quick Math</h2>
                                </div>

                                {!isMathPlaying ? (
                                    <div className="text-center space-y-6">
                                        <p className="text-slate-400">Solve as many problems as you can in 30 seconds!</p>
                                        {mathMessage && <p className="text-xl font-bold text-yellow-400">{mathMessage}</p>}
                                        <button onClick={startMathGame} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg hover:scale-105 flex items-center gap-2 mx-auto">
                                            <Play className="w-5 h-5" /> Start Game
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-md space-y-8 text-center">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-slate-400">Time: <span className={mathTimer < 10 ? "text-red-400" : "text-white"}>{mathTimer}s</span></span>
                                            <span className="text-slate-400">Score: <span className="text-green-400">{mathScore}</span></span>
                                        </div>
                                        <div className="text-6xl font-bold text-white py-8">{mathProblem?.question}</div>
                                        <form onSubmit={handleMathSubmit} className="flex gap-4">
                                            <input
                                                type="number"
                                                value={userAnswer}
                                                onChange={(e) => setUserAnswer(e.target.value)}
                                                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-6 py-4 text-2xl text-center text-white focus:outline-none focus:border-blue-500"
                                                placeholder="?"
                                                autoFocus
                                            />
                                            <button type="submit" className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold">Submit</button>
                                        </form>
                                        <p className={cn("h-6 font-bold", mathMessage.includes("Correct") ? "text-green-400" : "text-red-400")}>{mathMessage}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeGame === "tictactoe" && (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="flex items-center justify-between w-full max-w-md mb-8">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <X className="w-6 h-6 text-violet-400" /> Tic-Tac-Toe <Circle className="w-6 h-6 text-pink-400" />
                                    </h2>
                                    <button onClick={resetTicTacToe} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-3 bg-slate-800 p-3 rounded-2xl">
                                    {board.map((cell, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSquareClick(idx)}
                                            disabled={!!cell || !!tttWinner || !isXNext}
                                            className="w-24 h-24 bg-slate-900 rounded-xl flex items-center justify-center text-5xl font-bold hover:bg-slate-850 transition-colors disabled:cursor-default"
                                        >
                                            {cell === "X" && <X className="w-16 h-16 text-violet-400" />}
                                            {cell === "O" && <Circle className="w-12 h-12 text-pink-400" />}
                                        </button>
                                    ))}
                                </div>

                                {tttWinner && (
                                    <div className="mt-8 text-center animate-fade-in">
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {tttWinner === "Draw" ? "It's a Draw!" : `${tttWinner === "X" ? "You" : "AI"} Won!`}
                                        </h3>
                                        <button onClick={resetTicTacToe} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
                                            Play Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Rewards Shop (Sidebar) */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-400" />
                                Rewards Shop
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { name: "1 Hour Gaming", cost: 100, icon: Gamepad2 },
                                    { name: "Pizza Night", cost: 500, icon: "🍕" },
                                    { name: "Movie Ticket", cost: 300, icon: "🎬" },
                                    { name: "No Chores Day", cost: 1000, icon: "🧹" },
                                ].map((reward, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl">
                                                {typeof reward.icon === "string" ? reward.icon : <reward.icon className="w-5 h-5 text-violet-400" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-200">{reward.name}</p>
                                                <p className="text-xs text-yellow-400 font-bold">{reward.cost} pts</p>
                                            </div>
                                        </div>
                                        <button
                                            disabled={points < reward.cost}
                                            onClick={() => updatePoints(-reward.cost)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                                points >= reward.cost ? "bg-violet-600 text-white hover:bg-violet-500" : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                            )}
                                        >
                                            Redeem
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
