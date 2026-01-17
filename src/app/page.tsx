import { Sidebar } from "@/components/layout/Sidebar";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { Card } from "@/components/ui/Card";
import { Plus, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      <Sidebar />

      <main className="ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Adya!</span> 🎓
          </h1>
          <p className="text-gray-400">Here&apos;s what&apos;s happening today.</p>
        </header>

        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-violet-500 hover:bg-slate-800/80 transition-all group flex flex-col items-center justify-center gap-2">
                <div className="p-3 bg-violet-500/10 rounded-full text-violet-400 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-medium">Add Homework</span>
              </button>

              <button className="p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 transition-all group flex flex-col items-center justify-center gap-2">
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6" />
                </div>
                <span className="font-medium">Start Focus Timer</span>
              </button>
            </div>
          </section>


        </div>
      </main>
    </div>
  );
}
