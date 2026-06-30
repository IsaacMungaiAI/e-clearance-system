import { cn } from "@/lib/utils";

interface GlassLoadingProps {
    count?: number;
    className?: string;
    type?: "card" | "table" | "stats" | "list";
}

function SkeletonBar({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-lg bg-white/10",
                "before:absolute before:inset-0 before:-translate-x-full",
                "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
                "before:animate-shimmer",
                className
            )}
        />
    );
}

function GlassCard() {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-lg">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <SkeletonBar className="h-4 w-32" />
                    <SkeletonBar className="h-5 w-5 rounded-full" />
                </div>
                <SkeletonBar className="h-8 w-20" />
                <SkeletonBar className="h-3 w-40" />
            </div>
        </div>
    );
}

function GlassTable() {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg">
            <div className="space-y-0">
                <div className="flex items-center gap-4 border-b border-white/10 p-4">
                    <SkeletonBar className="h-4 w-1/4" />
                    <SkeletonBar className="h-4 w-1/6" />
                    <SkeletonBar className="h-4 w-1/6" />
                    <SkeletonBar className="h-4 w-1/6 ml-auto" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 border-b border-white/5 p-4"
                    >
                        <SkeletonBar className="h-4 w-1/3" />
                        <SkeletonBar className="h-5 w-16 rounded-full" />
                        <SkeletonBar className="h-4 w-20" />
                        <SkeletonBar className="h-4 w-16 ml-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function GlassStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <GlassCard key={i} />
            ))}
        </div>
    );
}

function GlassList() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 shadow-lg"
                >
                    <div className="flex items-start gap-3">
                        <SkeletonBar className="h-10 w-10 shrink-0 rounded-xl" />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <SkeletonBar className="h-4 w-48" />
                                <SkeletonBar className="h-3 w-14" />
                            </div>
                            <SkeletonBar className="h-3 w-64" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function GlassLoading({
    count = 1,
    className,
    type = "card",
}: GlassLoadingProps) {
    if (type === "table") {
        return (
            <div className={cn("space-y-4", className)}>
                <GlassTable />
            </div>
        );
    }

    if (type === "stats") {
        return (
            <div className={cn("space-y-6", className)}>
                <GlassStats />
                <GlassCard />
            </div>
        );
    }

    if (type === "list") {
        return (
            <div className={cn("space-y-4", className)}>
                <GlassList />
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <GlassCard key={i} />
            ))}
        </div>
    );
}
