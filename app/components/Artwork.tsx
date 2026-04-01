import React from "react";

interface ArtworkProps {
    thumbnailId?: string | null;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

export function Artwork({ thumbnailId, size = "md", className = "" }: ArtworkProps) {
    const sizeClasses = {
        sm: "w-10 h-10 rounded-xl",
        md: "w-12 h-12 rounded-2xl",
        lg: "w-16 h-16 rounded-[2rem]",
        xl: "w-64 h-64 rounded-[3rem]",
    };

    if (!thumbnailId) {
        return (
            <div className={`bg-gradient-to-br from-[var(--tg-theme-button-color)] to-[#24a1de] flex items-center justify-center shadow-inner ${sizeClasses[size]} ${className}`}>
                <svg className={`${size === "xl" ? "w-24 h-24" : "w-6 h-6"} text-white/50`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                </svg>
            </div>
        );
    }

    return (
        <div className={`${sizeClasses[size]} ${className} overflow-hidden shadow-lg border border-white/10`}>
            <img
                src={`/api/stream/${thumbnailId}`}
                alt="Artwork"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-[var(--tg-theme-button-color)]', 'to-[#24a1de]', 'flex', 'items-center', 'justify-center');
                }}
            />
        </div>
    );
}
