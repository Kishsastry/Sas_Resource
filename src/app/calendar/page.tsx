"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <Sidebar />

            <main className="md:ml-64 ml-0 p-4 md:p-8 min-h-screen flex flex-col">
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <CalendarIcon className="w-8 h-8 text-violet-400" />
                            Family Calendar
                        </h1>
                        <p className="text-slate-400">Stay organized with your shared family events.</p>
                    </div>
                </header>

                <Card variant="neon" className="flex-1 flex flex-col p-1 overflow-hidden min-h-[600px]">
                    <iframe
                        src="https://calendar.google.com/calendar/embed?src=family04716901839132097729%40group.calendar.google.com&ctz=America%2FChicago"
                        style={{ border: 0 }}
                        width="100%"
                        height="100%"
                        className="flex-1 rounded-lg w-full h-full min-h-[600px]"
                        frameBorder="0"
                        scrolling="no"
                    ></iframe>
                </Card>
            </main>
        </div>
    );
}
