import React, { useState, useEffect } from "react";
import { useAudioStore } from "~/store/audioStore";
import { Artwork } from "./Artwork";

export function FullPlayer() {
    const {
        currentTrack,
        isPlaying,
        togglePlay,
        nextTrack,
        prevTrack,
        shuffle,
        setShuffle,
        repeatMode,
        setRepeatMode,
        currentTime,
        setCurrentTime,
        setIsPlayerOpen,
        skipForward,
        skipBackward
    } = useAudioStore();

    const [localTime, setLocalTime] = useState(currentTime);
    const [isSeeking, setIsSeeking] = useState(false);

    useEffect(() => {
        if (!isSeeking) {
            setLocalTime(currentTime);
        }
    }, [currentTime, isSeeking]);

    if (!currentTrack) return null;

    const progress = (localTime / currentTrack.duration) * 100;

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        const newTime = (val / 100) * currentTrack.duration;
        setLocalTime(newTime);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-3xl flex flex-col p-6 animate-in slide-in-from-bottom duration-500 overflow-hidden">
            <header className="flex items-center justify-between pb-4">
                <button
                    onClick={() => setIsPlayerOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-[30px] backdrop-contrast-[1] flex items-center justify-center text-[var(--tg-theme-text-color)]/50 active:scale-90 transition-transform"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div className="flex-1 text-center px-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--tg-theme-hint-color)]">Now Playing</p>
                </div>
                <div className="w-10 h-10"></div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center space-y-8 py-2">
                <div className="transform scale-90 sm:scale-100 transition-transform">
                    <Artwork thumbnailId={currentTrack.thumbnailId} isPlaying={isPlaying} size="xl" />
                </div>

                <div className="text-center space-y-1 w-full px-4">
                    <h1 className="text-2xl text-white tracking-tight leading-tight uppercase italic truncate">{currentTrack.title}</h1>
                    <p className="text-base text-[var(--tg-theme-link-color)] font-bold uppercase tracking-tighter truncate">{currentTrack.artist}</p>
                </div>

                <div className="w-full space-y-2">
                    <div className="relative w-full h-1.5 bg-[var(--tg-theme-secondary-bg-color)] rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-[var(--tg-theme-button-color)] transition-all duration-100 ease-linear shadow-[0_0_12px_rgba(36,161,222,0.5)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={progress}
                            onPointerDown={() => setIsSeeking(true)}
                            onChange={handleProgressChange}
                            onPointerUp={() => {
                                setCurrentTime(localTime);
                                setIsSeeking(false);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-blue-500"
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-black tabular-nums text-[var(--tg-theme-hint-color)] uppercase tracking-widest px-1">
                        <span>{formatTime(localTime)}</span>
                        <span>-{formatTime(Math.max(0, currentTrack.duration - localTime))}</span>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center space-y-4">
                    {/* Main Controls */}
                    <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                        <button onClick={(e) => { e.stopPropagation(); skipBackward(); }} className="p-2 text-white/80 active:scale-90 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                                <text x="4" y="24" fontSize="6" fontWeight="bold" fill="currentColor">-10s</text>
                            </svg>
                        </button>

                        <button onClick={prevTrack} className="p-2 text-white/80 active:scale-90 transition-transform">
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                            </svg>
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-16 h-16 bg-white/30 backdrop-blur-[30px] backdrop-contrast-[1] text-[var(--tg-theme-button-text-color)] rounded-3xl flex items-center justify-center shadow-xl active:scale-95 transition-all"
                        >
                            {isPlaying ? (
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>

                        <button onClick={nextTrack} className="p-2 text-white/80 active:scale-90 transition-transform">
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 18l8.5-6L6 6zM16 6v12h2V6z" />
                            </svg>
                        </button>

                        <button onClick={(e) => { e.stopPropagation(); skipForward(); }} className="p-2 text-white/80 active:scale-90 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zm7.868 0a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" />
                                <text x="14" y="24" fontSize="6" fontWeight="bold" fill="currentColor">+10s</text>
                            </svg>
                        </button>
                    </div>

                    {/* Secondary Controls */}
                    <div className="w-full flex items-center justify-between px-8">
                        <button
                            onClick={() => setShuffle(!shuffle)}
                            className={`w-10 h-10 flex items-center justify-center transition-colors ${shuffle ? "text-[var(--tg-theme-button-color)]" : "text-white/80"}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </button>

                        <button
                            onClick={() => {
                                const modes: Array<'none' | 'all' | 'one'> = ['none', 'all', 'one'];
                                const next = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
                                setRepeatMode(next);
                            }}
                            className={`w-10 h-10 flex items-center justify-center transition-colors relative ${repeatMode !== 'none' ? "text-[var(--tg-theme-button-color)]" : "text-white/80"}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {repeatMode === 'one' && <span className="absolute text-[8px] font-black top-2 right-1">1</span>}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
