import { Card } from "@/components/ui/Card";
import { CheckCircle2, Trophy, Brain } from "lucide-react";

export function StatsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card variant="neon" className="flex items-center gap-4">
                <div className="p-3 bg-violet-500/20 rounded-full text-violet-400">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-400">Tasks Due Today</p>
                    <p className="text-2xl font-bold text-white">3</p>
                </div>
            </Card>

            <Card variant="neon" className="flex items-center gap-4">
                <div className="p-3 bg-lime-500/20 rounded-full text-lime-400">
                    <Trophy className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-400">Reward Points</p>
                    <p className="text-2xl font-bold text-white">1,250</p>
                </div>
            </Card>

            <Card variant="neon" className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                    <Brain className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-400">Wellness Streak</p>
                    <p className="text-2xl font-bold text-white">5 Days</p>
                </div>
            </Card>
        </div>
    );
}
