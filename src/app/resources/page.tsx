"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { ExternalLink, BookOpen, Youtube, FileText, Video } from "lucide-react";

const resources = [
    {
        category: "Calculus BC",
        icon: "∫",
        color: "text-violet-400",
        bgColor: "bg-violet-500/10",
        items: [
            { title: "Professor Leonard - Calculus Series", url: "https://www.youtube.com/c/professorleonard", type: "youtube" },
            { title: "Khan Academy - AP Calculus BC", url: "https://www.youtube.com/@khanacademy/search?query=calculus%20bc", type: "youtube" },
            { title: "3Blue1Brown - Essence of Calculus", url: "https://www.youtube.com/@3blue1brown/search?query=Calculus%20BC", type: "youtube" },
            { title: "Organic Chemistry Tutor - Calculus BC", url: "https://www.youtube.com/@TheOrganicChemistryTutor/search?query=Calculus%20BC", type: "youtube" },
            { title: "Mr. Yang's BC Class Notes & Study Guide", url: "https://mryangteacher.weebly.com/bc-class-notes.html", type: "link" },
        ]
    },
    {
        category: "Advanced Chemistry",
        icon: "🧪",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        items: [
            { title: "Organic Chemistry Tutor - AP Chemistry", url: "https://www.youtube.com/@TheOrganicChemistryTutor/search?query=AP%20Chemistry", type: "youtube" },
            { title: "Khan Academy - AP Chemistry", url: "https://www.youtube.com/@khanacademy/search?query=AP%20chemistry", type: "youtube" },
            { title: "Professor Dave Explains - AP Chemistry", url: "https://www.youtube.com/@ProfessorDaveExplains/search?query=AP%20Chemistry", type: "youtube" },
            { title: "Bozeman Science - AP Chemistry", url: "https://www.youtube.com/@Bozemanscience1/search?query=AP%20Chemistry", type: "youtube" },
            { title: "AP Chemistry Study Materials (Google Drive)", url: "https://drive.google.com/drive/folders/18fPxUXsZwJlkv3H5iQzpl08XMrHWR-bK?usp=sharing", type: "drive" },
        ]
    },
    {
        category: "AP World History",
        icon: "🌍",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        items: [
            { title: "Heimler's History", url: "https://www.youtube.com/@heimlershistory", type: "youtube" },
            { title: "Crash Course World History", url: "https://www.youtube.com/@crashcourse/search?query=AP%20World%20History", type: "youtube" },
            { title: "Khan Academy - AP World History", url: "https://www.youtube.com/@khanacademy/search?query=AP%20World%20History", type: "youtube" },
            { title: "OER Project - AP World History", url: "https://www.oerproject.com/AP-World-History", type: "link" },
            { title: "Fiveable AP World Study Library", url: "https://library.fiveable.me/ap-world", type: "link" },
            { title: "AP World History Study Guide (PDF)", url: "https://uploads-ssl.webflow.com/605fe570e5454a357d1e1811/609f602ab8c522d2fbb74495_SS-AP-World-History.pdf", type: "pdf" },
        ]
    },
    {
        category: "AP Spanish",
        icon: "🇪🇸",
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        items: [
            { title: "Best AP Spanish Resource (Spanish Maestro David)", url: "https://sites.google.com/site/spanishmaestrodavid/ap-spanish-language-and-culture", type: "link" },
            { title: "AP Spanish - All Units (YouTube Playlist)", url: "https://www.youtube.com/watch?v=1O0CrlozVh0", type: "youtube" },
        ]
    },
    {
        category: "Test Prep",
        icon: "📝",
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        items: [
            { title: "Khan Academy Digital SAT Prep", url: "https://www.khanacademy.org/test-prep/digital-sat", type: "link" },
            { title: "College Board SAT Practice", url: "https://satsuite.collegeboard.org/practice", type: "link" },
            { title: "AoPS AMC 10 Problems & Solutions", url: "https://artofproblemsolving.com/wiki/index.php/AMC_10_Problems_and_Solutions", type: "link" },
            { title: "AoPS AMC 12 Problems & Solutions", url: "https://artofproblemsolving.com/wiki/index.php/AMC_12_Problems_and_Solutions", type: "link" },
        ]
    },
    {
        category: "Other Resources",
        icon: "🔗",
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
        items: [
            { title: "My Tracker", url: "https://docs.google.com/spreadsheets/d/1MTCINPlzJ49BLcmjfeWdrk7sG5t1tfLedscpnklLdQE/edit?gid=1180976633#gid=1180976633", type: "sheet" },
            { title: "Extracurriculars Tracker", url: "https://docs.google.com/spreadsheets/d/1FSRN6tYqrqL4QlyFgCBhQmcH8pmY14PAJ9NbpQggAaw/edit?gid=1352604431#gid=1352604431", type: "sheet" },
            { title: "Journal of Emerging Investigators", url: "https://emerginginvestigators.org/", type: "link" },
        ]
    }
];

function getIcon(type: string) {
    switch (type) {
        case "youtube": return <Youtube className="w-4 h-4" />;
        case "pdf": return <FileText className="w-4 h-4" />;
        case "video": return <Video className="w-4 h-4" />;
        default: return <ExternalLink className="w-4 h-4" />;
    }
}

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <Sidebar />

            <main className="ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-violet-400" />
                        Study Resources
                    </h1>
                    <p className="text-slate-400">Curated materials to help you succeed.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((category) => (
                        <Card key={category.category} variant="neon" className="flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-3 rounded-full ${category.bgColor} ${category.color} text-xl font-bold w-12 h-12 flex items-center justify-center`}>
                                    {category.icon}
                                </div>
                                <h2 className="text-xl font-bold text-white">{category.category}</h2>
                            </div>

                            <div className="space-y-3 flex-1">
                                {category.items.map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-violet-500/50 transition-all group"
                                    >
                                        <div className="text-slate-400 group-hover:text-violet-400 transition-colors">
                                            {getIcon(item.type)}
                                        </div>
                                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors line-clamp-1">
                                            {item.title}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
