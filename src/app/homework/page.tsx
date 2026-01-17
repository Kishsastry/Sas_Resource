"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { BookOpen, Plus, Clock, CheckCircle2, Trash2 } from "lucide-react";

interface Assignment {
    id: string;
    title: string;
    subject: string;
    dueDate: string; // YYYY-MM-DD
    priority: "High" | "Medium" | "Low";
    completed: boolean;
}

export default function HomeworkPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
        priority: "Medium",
        dueDate: new Date().toISOString().split("T")[0],
    });

    // Load assignments from localStorage
    useEffect(() => {
        const savedAssignments = localStorage.getItem("homework_assignments");
        if (savedAssignments) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAssignments(JSON.parse(savedAssignments));
        } else {
            // Mock initial data
            const initialAssignments: Assignment[] = [
                {
                    id: "1",
                    title: "Chapter 5 Problems",
                    subject: "AP Calculus BC",
                    dueDate: new Date().toISOString().split("T")[0],
                    priority: "High",
                    completed: false,
                },
                {
                    id: "2",
                    title: "Read Act 3",
                    subject: "AP Lit",
                    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0],
                    priority: "Medium",
                    completed: false,
                },
            ];
            setAssignments(initialAssignments);
            localStorage.setItem("homework_assignments", JSON.stringify(initialAssignments));
        }
    }, []);

    const saveAssignments = (updatedAssignments: Assignment[]) => {
        setAssignments(updatedAssignments);
        localStorage.setItem("homework_assignments", JSON.stringify(updatedAssignments));
    };

    const handleAddAssignment = () => {
        if (!newAssignment.title || !newAssignment.subject) return;

        const assignment: Assignment = {
            id: Date.now().toString(),
            title: newAssignment.title,
            subject: newAssignment.subject,
            dueDate: newAssignment.dueDate || new Date().toISOString().split("T")[0],
            priority: newAssignment.priority as "High" | "Medium" | "Low",
            completed: false,
        };

        saveAssignments([...assignments, assignment]);
        setShowAddModal(false);
        setNewAssignment({ priority: "Medium", dueDate: new Date().toISOString().split("T")[0] });
    };

    const toggleComplete = (id: string) => {
        const updated = assignments.map((a) =>
            a.id === id ? { ...a, completed: !a.completed } : a
        );
        saveAssignments(updated);
    };

    const deleteAssignment = (id: string) => {
        const updated = assignments.filter((a) => a.id !== id);
        saveAssignments(updated);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High": return "text-red-400 bg-red-500/10 border-red-500/20";
            case "Medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
            case "Low": return "text-green-400 bg-green-500/10 border-green-500/20";
            default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <Sidebar />

            <main className="ml-64 p-8 min-h-screen flex flex-col">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-violet-400" />
                            Homework Tracker
                        </h1>
                        <p className="text-slate-400">Keep track of your assignments and deadlines.</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add Assignment
                    </button>
                </header>

                <div className="grid gap-4">
                    {assignments.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>No assignments yet. Great job!</p>
                        </div>
                    ) : (
                        assignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((assignment) => (
                            <Card
                                key={assignment.id}
                                variant="neon"
                                className={cn(
                                    "flex items-center justify-between p-5 transition-all group",
                                    assignment.completed ? "opacity-60 bg-slate-900/30" : "hover:scale-[1.01]"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => toggleComplete(assignment.id)}
                                        className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                            assignment.completed
                                                ? "bg-green-500 border-green-500 text-slate-950"
                                                : "border-slate-600 hover:border-violet-500 text-transparent"
                                        )}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                    <div>
                                        <h3 className={cn("text-lg font-medium transition-all", assignment.completed && "line-through text-slate-500")}>
                                            {assignment.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                                            <span className="text-violet-400 font-medium">{assignment.subject}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(assignment.dueDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", getPriorityColor(assignment.priority))}>
                                        {assignment.priority}
                                    </span>
                                    <button
                                        onClick={() => deleteAssignment(assignment.id)}
                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </main>

            {/* Add Assignment Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-violet-500/10">
                        <h3 className="text-xl font-bold text-white mb-4">Add Assignment</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newAssignment.title || ""}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 focus:outline-none"
                                    placeholder="e.g. Read Chapter 4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={newAssignment.subject || ""}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 focus:outline-none"
                                    placeholder="e.g. AP History"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={newAssignment.dueDate || ""}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Priority</label>
                                    <select
                                        value={newAssignment.priority}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, priority: e.target.value as "High" | "Medium" | "Low" })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 focus:outline-none"
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddAssignment}
                                className="flex-1 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors font-medium"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
