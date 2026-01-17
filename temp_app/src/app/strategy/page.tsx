"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { Compass, Target, BookOpen, Calendar, Award, Info, X } from "lucide-react";

interface School {
    name: string;
    status: "Target" | "Reach" | "Safety";
    criteria?: string;
    criteriaUrl?: string;
}

export default function StrategyPage() {
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

    const schools: School[] = [
        { name: "University of Texas at Austin", status: "Target", criteriaUrl: "/ut_cs.html" },
        { name: "Texas A&M University", status: "Target", criteriaUrl: "/tamu_cs.html" },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <Sidebar />

            <main className="ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Compass className="w-8 h-8 text-violet-400" />
                        College App Strategy
                    </h1>
                    <p className="text-slate-400">Plan your path to your dream university.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Target Schools */}
                    <Card variant="neon" className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-violet-500/10 rounded-full">
                                <Target className="w-6 h-6 text-violet-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Target Schools</h2>
                        </div>
                        <div className="space-y-4 text-slate-400">
                            <p className="italic">Add your dream, target, and safety schools here.</p>
                            <div className="space-y-3">
                                {schools.map((school, idx) => (
                                    <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 flex items-center justify-between group hover:border-violet-500 transition-colors">
                                        <div>
                                            <div className="font-medium text-slate-200">{school.name}</div>
                                            <button
                                                onClick={() => setSelectedSchool(school)}
                                                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 mt-1 transition-colors"
                                            >
                                                <Info className="w-3 h-3" /> Admission Criteria
                                            </button>
                                        </div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                            {school.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Essay Topics */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500/10 rounded-full">
                                <BookOpen className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Essay Topics</h2>
                        </div>
                        <div className="space-y-4 text-slate-400">
                            <p className="italic">Brainstorm and track your personal statement ideas.</p>
                            {/* Placeholder content */}
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed flex items-center justify-center">
                                <span>Waiting for content...</span>
                            </div>
                        </div>
                    </Card>

                    {/* Key Deadlines */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-pink-500/10 rounded-full">
                                <Calendar className="w-6 h-6 text-pink-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Key Deadlines</h2>
                        </div>
                        <div className="space-y-4 text-slate-400">
                            <p className="italic">Important dates for applications and scholarships.</p>
                            {/* Placeholder content */}
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed flex items-center justify-center">
                                <span>Waiting for content...</span>
                            </div>
                        </div>
                    </Card>

                    {/* Extracurriculars */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-yellow-500/10 rounded-full">
                                <Award className="w-6 h-6 text-yellow-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Extracurricular Highlights</h2>
                        </div>
                        <div className="space-y-4 text-slate-400">
                            <p className="italic">Showcase your leadership and achievements.</p>
                            {/* Placeholder content */}
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed flex items-center justify-center">
                                <span>Waiting for content...</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>

            {/* Admission Criteria Modal */}
            {selectedSchool && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-4xl shadow-2xl shadow-violet-500/10 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Info className="w-5 h-5 text-violet-400" />
                                Admission Criteria
                            </h3>
                            <button
                                onClick={() => setSelectedSchool(null)}
                                className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-violet-300 mb-2">{selectedSchool.name}</h4>
                            <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 text-slate-300 text-sm leading-relaxed h-[70vh]">
                                {selectedSchool.criteriaUrl ? (
                                    <iframe
                                        src={selectedSchool.criteriaUrl}
                                        className="w-full h-full border-0 bg-white"
                                        title={`${selectedSchool.name} Admission Criteria`}
                                    />
                                ) : selectedSchool.criteria ? (
                                    <div className="p-4 overflow-y-auto h-full" dangerouslySetInnerHTML={{ __html: selectedSchool.criteria }} />
                                ) : (
                                    <div className="p-4 flex items-center justify-center h-full">
                                        <p className="italic text-slate-500">No admission criteria added yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setSelectedSchool(null)}
                                className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
