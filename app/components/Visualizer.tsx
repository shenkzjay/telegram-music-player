import React from "react";

interface VisualizerProps {
    isPlaying: boolean;
    size?: "sm" | "md" | "lg" | "xl";
}

export function Visualizer({ isPlaying, size = "md" }: VisualizerProps) {
    const barCount = size === "xl" ? 12 : 5;
    const bars = Array.from({ length: barCount });

    return (
        <div className="flex items-end justify-center space-x-1 h-1/2 w-full px-2">
            {bars.map((_, i) => (
                <div
                    key={i}
                    className="bg-white/80 rounded-full w-full max-w-[4px]"
                    style={{
                        height: isPlaying ? `${20 + Math.random() * 80}%` : "15%",
                        transition: "height 0.2s ease-in-out",
                        animation: isPlaying ? `visualizer-bar 1s ease-in-out infinite alternate` : "none",
                        animationDelay: `${i * 0.1}s`,
                    }}
                />
            ))}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes visualizer-bar {
                    0% { height: 20%; }
                    100% { height: 100%; }
                }
            `}} />
        </div>
    );
}
