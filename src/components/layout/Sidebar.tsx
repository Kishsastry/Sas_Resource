"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, BookOpen, Heart, Gamepad2, Sparkles, GraduationCap, Lightbulb, Library, Compass, Menu, X } from "lucide-react";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/calendar", label: "Family Calendar", icon: Calendar },
    { href: "/homework", label: "Homework", icon: BookOpen },
    { href: "/resources", label: "Resources", icon: Library },
    { href: "/wellness", label: "Wellness", icon: Heart },
    { href: "/passion", label: "Passion Projects", icon: Lightbulb },
    { href: "/strategy", label: "College Strategy", icon: Compass },
    { href: "/ai-tools", label: "Gen AI Tools", icon: Sparkles },
    { href: "/games", label: "Games & Rewards", icon: Gamepad2 },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-[60] p-2 bg-slate-900 rounded-lg text-white md:hidden hover:bg-slate-800 border border-slate-800"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[40] md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "w-64 h-screen fixed left-0 top-0 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 flex items-center gap-3 text-violet-400 pl-20 md:pl-6">
                    <GraduationCap className="w-8 h-8" />
                    <span className="font-bold text-xl tracking-tight text-white">HS Organizer</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                    isActive
                                        ? "bg-violet-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-violet-400")} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Current Focus</p>
                        <p className="text-sm font-medium text-white">AP Calculus BC</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
