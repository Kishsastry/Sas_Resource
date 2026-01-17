import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: "default" | "glass" | "neon";
}

export function Card({ children, className, variant = "default", ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-xl p-6 transition-all duration-300",
                variant === "default" && "bg-slate-800 border border-slate-700 text-slate-50",
                variant === "glass" && "glass text-slate-50",
                variant === "neon" && "bg-slate-900 border border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] text-slate-50",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
