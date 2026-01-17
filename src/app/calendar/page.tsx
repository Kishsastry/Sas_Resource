"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Users, User, MapPin, Settings, RefreshCw } from "lucide-react";

interface Event {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    time: string;
    type: "personal" | "family";
    location?: string;
    description?: string;
    source?: "local" | "google";
}

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<"personal" | "family">("family");
    const [events, setEvents] = useState<Event[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [icalUrl, setIcalUrl] = useState("");
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
    const [newEvent, setNewEvent] = useState<Partial<Event>>({
        type: "family",
        date: new Date().toISOString().split("T")[0],
    });

    // Load events and settings from localStorage
    useEffect(() => {
        const savedEvents = localStorage.getItem("calendar_events");
        const savedIcalUrl = localStorage.getItem("google_ical_url");

        if (savedIcalUrl) {
            setIcalUrl(savedIcalUrl);
        }

        let localEvents: Event[] = [];
        if (savedEvents) {
            localEvents = JSON.parse(savedEvents);
        } else {
            // Mock initial events
            localEvents = [
                {
                    id: "1",
                    title: "Math Test",
                    date: new Date().toISOString().split("T")[0],
                    time: "10:00",
                    type: "personal",
                    location: "Room 304",
                    source: "local"
                },
                {
                    id: "2",
                    title: "Family Dinner",
                    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split("T")[0],
                    time: "19:00",
                    type: "family",
                    location: "Home",
                    source: "local"
                },
            ];
            localStorage.setItem("calendar_events", JSON.stringify(localEvents));
        }
        setEvents(localEvents);

        if (savedIcalUrl) {
            fetchGoogleEvents(savedIcalUrl, localEvents);
        }
    }, []);

    const fetchGoogleEvents = async (url: string, currentLocalEvents: Event[]) => {
        setIsLoadingGoogle(true);
        try {
            const response = await fetch(`/api/calendar?url=${encodeURIComponent(url)}`);
            if (response.ok) {
                const data = await response.json();
                const googleEvents: Event[] = data.events.map((e: any) => {
                    const dateObj = new Date(e.start);
                    return {
                        id: `google-${e.id}`,
                        title: e.title,
                        date: dateObj.toISOString().split("T")[0],
                        time: e.allDay ? "All Day" : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: "family", // Default to family for shared calendar
                        location: e.location,
                        description: e.description,
                        source: "google"
                    };
                });

                // Merge local and google events
                // Filter out old google events from state to avoid duplicates if re-fetching
                const nonGoogleEvents = currentLocalEvents.filter(e => e.source !== "google");
                setEvents([...nonGoogleEvents, ...googleEvents]);
            }
        } catch (error) {
            console.error("Failed to fetch Google Calendar events", error);
        } finally {
            setIsLoadingGoogle(false);
        }
    };

    const handleSaveSettings = () => {
        localStorage.setItem("google_ical_url", icalUrl);
        setShowSettingsModal(false);
        // Reload events
        const savedEvents = localStorage.getItem("calendar_events");
        const localEvents = savedEvents ? JSON.parse(savedEvents) : [];
        fetchGoogleEvents(icalUrl, localEvents);
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        return { daysInMonth, firstDayOfMonth };
    };

    const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleAddEvent = () => {
        if (!newEvent.title || !newEvent.date) return;

        const event: Event = {
            id: Date.now().toString(),
            title: newEvent.title,
            date: newEvent.date,
            time: newEvent.time || "All Day",
            type: newEvent.type as "personal" | "family",
            location: newEvent.location,
            description: newEvent.description,
            source: "local"
        };

        // Only save local events to localStorage
        const localEvents = events.filter(e => e.source !== "google");
        const updatedLocalEvents = [...localEvents, event];

        // Update state with ALL events (including current google ones)
        const googleEvents = events.filter(e => e.source === "google");
        setEvents([...updatedLocalEvents, ...googleEvents]);

        localStorage.setItem("calendar_events", JSON.stringify(updatedLocalEvents));
        setShowAddModal(false);
        setNewEvent({ type: view, date: new Date().toISOString().split("T")[0] });
    };

    const filteredEvents = events.filter((e) => e.type === view);

    const getEventsForDay = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return filteredEvents.filter((e) => e.date === dateStr);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <Sidebar />

            <main className="md:ml-64 ml-0 p-4 md:p-8 min-h-screen flex flex-col">
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <CalendarIcon className="w-8 h-8 text-violet-400" />
                            {view === "family" ? "Family Calendar" : "My Schedule"}
                        </h1>
                        <p className="text-slate-400">Stay organized with your shared family events.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex">
                            <button
                                onClick={() => setView("personal")}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                    view === "personal" ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" : "text-slate-400 hover:text-white"
                                )}
                            >
                                <User className="w-4 h-4" /> Personal
                            </button>
                            <button
                                onClick={() => setView("family")}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                    view === "family" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:text-white"
                                )}
                            >
                                <Users className="w-4 h-4" /> Family
                            </button>
                        </div>
                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2"
                            title="Google Calendar Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-lime-500 hover:bg-lime-400 text-slate-950 px-4 py-2 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(132,204,22,0.3)] hover:shadow-[0_0_25px_rgba(132,204,22,0.5)] flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Add Event
                        </button>
                    </div>
                </header>

                <Card variant="neon" className="flex-1 flex flex-col p-6 overflow-hidden">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                            {isLoadingGoogle && <RefreshCw className="w-5 h-5 animate-spin text-slate-500" />}
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-px bg-slate-800 border border-slate-800 rounded-xl overflow-hidden flex-1">
                        {/* Days Header */}
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <div key={day} className="bg-slate-900 p-4 text-center text-sm font-medium text-slate-400 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}

                        {/* Empty cells for previous month */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="bg-slate-950/50 min-h-[120px]" />
                        ))}

                        {/* Days of the month */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dayEvents = getEventsForDay(day);
                            const isToday =
                                day === new Date().getDate() &&
                                currentDate.getMonth() === new Date().getMonth() &&
                                currentDate.getFullYear() === new Date().getFullYear();

                            return (
                                <div
                                    key={day}
                                    className={cn(
                                        "bg-slate-900/30 p-3 min-h-[120px] transition-colors hover:bg-slate-900/50 relative group border-t border-l border-slate-800/50",
                                        isToday && "bg-violet-500/5"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-2",
                                            isToday ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" : "text-slate-400"
                                        )}
                                    >
                                        {day}
                                    </span>
                                    <div className="space-y-1.5">
                                        {dayEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className={cn(
                                                    "text-xs p-1.5 rounded-md truncate border cursor-pointer transition-transform hover:scale-105",
                                                    event.source === "google"
                                                        ? "bg-orange-500/10 border-orange-500/30 text-orange-300 hover:border-orange-500"
                                                        : event.type === "family"
                                                            ? "bg-blue-500/10 border-blue-500/30 text-blue-300 hover:border-blue-500"
                                                            : "bg-violet-500/10 border-violet-500/30 text-violet-300 hover:border-violet-500"
                                                )}
                                                title={`${event.time} - ${event.title} ${event.source === 'google' ? '(Google Calendar)' : ''}`}
                                            >
                                                <span className="opacity-75 mr-1">{event.time}</span>
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </main>

            {/* Add Event Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-violet-500/10">
                        <h3 className="text-xl font-bold text-white mb-4">Add New Event</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newEvent.title || ""}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 focus:outline-none"
                                    placeholder="Event title"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={newEvent.date || ""}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Time</label>
                                    <input
                                        type="time"
                                        value={newEvent.time || ""}
                                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Type</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={newEvent.type === "personal"}
                                            onChange={() => setNewEvent({ ...newEvent, type: "personal" })}
                                            className="accent-violet-500"
                                        />
                                        <span className="text-slate-300">Personal</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={newEvent.type === "family"}
                                            onChange={() => setNewEvent({ ...newEvent, type: "family" })}
                                            className="accent-blue-500"
                                        />
                                        <span className="text-slate-300">Family</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        value={newEvent.location || ""}
                                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 pl-10 text-white focus:border-violet-500 focus:outline-none"
                                        placeholder="Add location"
                                    />
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
                                onClick={handleAddEvent}
                                className="flex-1 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors font-medium"
                            >
                                Save Event
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Google Calendar Settings Modal */}
            {showSettingsModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-violet-500/10">
                        <h3 className="text-xl font-bold text-white mb-4">Google Calendar Integration</h3>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-400">
                                To sync your Google Calendar, paste your <strong>Secret address in iCal format</strong> below.
                                You can find this in your Google Calendar settings under "Integrate calendar".
                            </p>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">iCal URL</label>
                                <input
                                    type="text"
                                    value={icalUrl}
                                    onChange={(e) => setIcalUrl(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 focus:outline-none text-sm"
                                    placeholder="https://calendar.google.com/calendar/ical/..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowSettingsModal(false)}
                                className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveSettings}
                                className="flex-1 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors font-medium"
                            >
                                Save & Sync
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
