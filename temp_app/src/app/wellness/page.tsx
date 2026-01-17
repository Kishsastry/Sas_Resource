"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Heart, Wind, Quote, Smile, Frown, Meh, Play, Pause } from "lucide-react";

const QUOTES = [
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "You are enough just as you are.", author: "Meghan Markle" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Happiness is not by chance, but by choice.", author: "Jim Rohn" },
    { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
];

export default function WellnessPage() {
    const [mood, setMood] = useState<string | null>(null);
    const [quote, setQuote] = useState(QUOTES[0]);
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        // Load saved mood
        const savedMood = localStorage.getItem("daily_mood");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (savedMood) setMood(savedMood);

        // Random quote
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, []);

    const handleMoodSelect = (selectedMood: string) => {
        setMood(selectedMood);
        localStorage.setItem("daily_mood", selectedMood);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isBreathing) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    const newTime = prev + 1;
                    if (newTime <= 4) setBreathPhase("Inhale");
                    else if (newTime <= 8) setBreathPhase("Hold");
                    else if (newTime <= 16) setBreathPhase("Exhale");
                    else return 0; // Reset cycle
                    return newTime;
                });
            }, 1000);
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTimer(0);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setBreathPhase("Inhale");
        }
        return () => clearInterval(interval);
    }, [isBreathing]);

    const toggleBreathing = () => setIsBreathing(!isBreathing);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <Sidebar />

            <main className="ml-64 p-8 min-h-screen flex flex-col">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Heart className="w-8 h-8 text-pink-500" />
                        Wellness Center
                    </h1>
                    <p className="text-slate-400">Take a moment for yourself. You deserve it.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
                    {/* Mood Tracker */}
                    <Card variant="neon" className="p-8 flex flex-col items-center justify-center text-center space-y-6">
                        <h2 className="text-2xl font-bold text-white">How are you feeling today?</h2>
                        <div className="flex gap-6">
                            {[
                                { icon: Smile, label: "Great", color: "text-green-400", bg: "hover:bg-green-500/20" },
                                { icon: Meh, label: "Okay", color: "text-yellow-400", bg: "hover:bg-yellow-500/20" },
                                { icon: Frown, label: "Rough", color: "text-red-400", bg: "hover:bg-red-500/20" },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => handleMoodSelect(item.label)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all transform hover:scale-110",
                                        item.bg,
                                        mood === item.label ? "bg-slate-800 ring-2 ring-white scale-110" : "bg-slate-900/50"
                                    )}
                                >
                                    <item.icon className={cn("w-12 h-12", item.color)} />
                                    <span className="font-medium text-slate-300">{item.label}</span>
                                </button>
                            ))}
                        </div>
                        {mood && (
                            <p className="text-slate-400 animate-fade-in">
                                Thanks for checking in. <span className="text-violet-400 font-medium">It&apos;s okay to feel {mood.toLowerCase()}.</span>
                            </p>
                        )}
                    </Card>

                    {/* Daily Quote */}
                    <Card className="p-8 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-violet-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-violet-500/20" />
                        <Quote className="w-10 h-10 text-violet-500 mb-4 opacity-50" />
                        <blockquote className="text-xl font-medium text-white italic mb-4 relative z-10">
                            &quot;{quote.text}&quot;
                        </blockquote>
                        <cite className="text-slate-400 not-italic font-medium">— {quote.author}</cite>
                    </Card>

                    {/* Breathing Exercise */}
                    <Card className="lg:col-span-2 p-8 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
                        <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                            <div className="flex items-center gap-3 mb-6">
                                <Wind className="w-6 h-6 text-blue-400" />
                                <h2 className="text-2xl font-bold text-white">4-7-8 Breathing</h2>
                            </div>

                            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                                {/* Breathing Circle Animation */}
                                <div
                                    className={cn(
                                        "absolute inset-0 rounded-full border-4 border-blue-500/30 transition-all duration-[4000ms] ease-in-out",
                                        isBreathing && breathPhase === "Inhale" && "scale-100 border-blue-400 opacity-100",
                                        isBreathing && breathPhase === "Hold" && "scale-100 border-blue-400 opacity-100",
                                        isBreathing && breathPhase === "Exhale" && "scale-50 border-blue-500/30 opacity-50",
                                        !isBreathing && "scale-75 opacity-30"
                                    )}
                                />
                                <div
                                    className={cn(
                                        "w-48 h-48 rounded-full bg-blue-500/10 flex items-center justify-center backdrop-blur-sm transition-all duration-[4000ms]",
                                        isBreathing && breathPhase === "Inhale" && "scale-110 bg-blue-500/20",
                                        isBreathing && breathPhase === "Exhale" && "scale-90 bg-blue-500/5"
                                    )}
                                >
                                    <div className="text-center">
                                        <span className="block text-3xl font-bold text-blue-300 mb-1">
                                            {isBreathing ? breathPhase : "Ready?"}
                                        </span>
                                        {isBreathing && <span className="text-xl text-blue-400/70">{timer}s</span>}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={toggleBreathing}
                                className={cn(
                                    "px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:scale-105",
                                    isBreathing
                                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                        : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/25"
                                )}
                            >
                                {isBreathing ? (
                                    <>
                                        <Pause className="w-5 h-5" /> Stop Exercise
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5" /> Start Breathing
                                    </>
                                )}
                            </button>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
