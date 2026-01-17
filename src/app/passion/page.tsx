"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { Lightbulb, ExternalLink, Bot, FileText } from "lucide-react";

export default function PassionPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <Sidebar />

            <main className="ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Lightbulb className="w-8 h-8 text-yellow-400" />
                        Passion Projects
                    </h1>
                    <p className="text-slate-400">Explore your interests and build your future.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* AI/ML Resources */}
                    <Card variant="neon" className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-violet-500/10 rounded-full">
                                <Bot className="w-6 h-6 text-violet-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">AI/ML Resources</h2>
                        </div>

                        <div className="space-y-4">
                            <a
                                href="https://drive.google.com/file/d/1cI46n954c143bYjXSFlWUNuECqqSDtxc/view?usp=drive_link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-violet-500 hover:bg-slate-800 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-slate-200 group-hover:text-white transition-colors">Python ML for Beginners</h3>
                                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                                </div>
                                <p className="text-sm text-slate-400">Comprehensive guide to starting with Machine Learning using Python.</p>
                            </a>

                            <a
                                href="https://drive.google.com/file/d/1wWJ6tNyIk1hX18rdsCDTkKqFV6PbIqdk/view?usp=drive_link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-violet-500 hover:bg-slate-800 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-slate-200 group-hover:text-white transition-colors">Demystifying Generative AI</h3>
                                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                                </div>
                                <p className="text-sm text-slate-400">Deep dive into how Generative AI models work and how to use them.</p>
                            </a>

                            <a
                                href="https://docs.google.com/document/d/1NNG1-zwjEIMKcyhg5-ni26p4iD7MhdU5HI_0uLAtkEI/edit?tab=t.0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-violet-500 hover:bg-slate-800 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-slate-200 group-hover:text-white transition-colors">Roadmap for AI/ML Learning</h3>
                                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                                </div>
                                <p className="text-sm text-slate-400">A comprehensive roadmap for learning AI and Machine Learning.</p>
                            </a>
                        </div>
                    </Card>

                    {/* Placeholder for future projects */}
                    <Card variant="default" className="p-6 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-800 bg-transparent">
                        <div className="p-4 bg-slate-900 rounded-full mb-4">
                            <FileText className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-300 mb-2">More Projects Coming Soon</h3>
                        <p className="text-slate-500 max-w-xs">
                            This space is reserved for your future passion projects, research papers, and creative endeavors.
                        </p>
                    </Card>
                </div>
            </main>
        </div>
    );
}
