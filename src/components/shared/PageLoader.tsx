import { LuLoader } from "react-icons/lu";

export default function PageLoader({ label = "Loading..." }: { label?: string }) {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background">
            <LuLoader className="w-10 h-10 animate-spin text-primary" />
            <p className="mt-4 text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                {label}
            </p>
        </div>
    );
}
