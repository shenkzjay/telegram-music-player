import { useAudioStore } from "~/store/audioStore";

export function MusicPlayerPage({ user, channel }: { user: any; channel: any }) {
    const { playlist, currentTrack, isPlaying, playTrack, togglePlay } = useAudioStore();

    return (
        <div className="p-6 pb-32 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex items-center justify-between pb-4 border-b border-[var(--tg-theme-hint-color)]/10">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight leading-none uppercase italic">Musichome</h1>
                    <p className="text-sm text-[var(--tg-theme-hint-color)] font-bold uppercase tracking-tighter">
                        {channel?.tgChatId || "Personal Library"}
                    </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[var(--tg-theme-secondary-bg-color)] flex items-center justify-center border border-[var(--tg-theme-hint-color)]/10">
                    <svg className="w-6 h-6 text-[var(--tg-theme-link-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </div>
            </header>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black text-[var(--tg-theme-hint-color)] uppercase tracking-widest pl-1">Your Tracks</h2>
                    <span className="text-[10px] font-bold text-[var(--tg-theme-link-color)] bg-[var(--tg-theme-link-color)]/10 px-2 py-0.5 rounded-full">{playlist.length} Songs</span>
                </div>

                <div className="space-y-3">
                    {playlist.length > 0 ? (
                        playlist.map((track) => (
                            <div
                                key={track.id}
                                onClick={() => playTrack(track)}
                                className={`group flex items-center p-4 rounded-3xl border transition-all cursor-pointer active:scale-95 ${currentTrack?.id === track.id
                                        ? "bg-[var(--tg-theme-button-color)] border-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] shadow-lg scale-[1.02]"
                                        : "bg-[var(--tg-theme-secondary-bg-color)] border-[var(--tg-theme-hint-color)]/5 hover:border-[var(--tg-theme-link-color)]/20"
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform ${currentTrack?.id === track.id ? "bg-white/20" : "bg-gradient-to-br from-[var(--tg-theme-button-color)] to-[#24a1de]"
                                    }`}>
                                    {currentTrack?.id === track.id && isPlaying ? (
                                        <div className="flex items-end space-x-1 h-4">
                                            <div className="w-1 bg-current rounded-full animate-[bounce_0.6s_ease-in-out_infinite]"></div>
                                            <div className="w-1 bg-current rounded-full animate-[bounce_0.8s_ease-in-out_infinite]"></div>
                                            <div className="w-1 bg-current rounded-full animate-[bounce_0.7s_ease-in-out_infinite]"></div>
                                        </div>
                                    ) : (
                                        <svg className={`w-6 h-6 ${currentTrack?.id === track.id ? "text-white" : "text-[var(--tg-theme-button-text-color)]"}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-4 flex-1 overflow-hidden">
                                    <h3 className="font-bold text-base truncate leading-tight">{track.title}</h3>
                                    <p className={`text-xs truncate mt-0.5 font-medium ${currentTrack?.id === track.id ? "opacity-70" : "text-[var(--tg-theme-hint-color)]"}`}>
                                        {track.artist}
                                    </p>
                                </div>
                                <div className={`text-[10px] font-black tabular-nums ${currentTrack?.id === track.id ? "opacity-70" : "text-[var(--tg-theme-hint-color)]"}`}>
                                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center space-y-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-3xl border border-dashed border-[var(--tg-theme-hint-color)]/20">
                            <div className="w-16 h-16 bg-[var(--tg-theme-hint-color)]/10 rounded-full flex items-center justify-center mx-auto text-[var(--tg-theme-hint-color)]">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                            <p className="text-sm font-bold text-[var(--tg-theme-hint-color)] uppercase tracking-tight">No music found yet</p>
                        </div>
                    )}
                </div>
            </section>

            {currentTrack && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--tg-theme-bg-color)] via-[var(--tg-theme-bg-color)] to-transparent pointer-events-none">
                    <div className="pointer-events-auto h-20 bg-[var(--tg-theme-button-color)]/95 backdrop-blur-xl rounded-[2.5rem] flex items-center px-6 shadow-2xl space-x-4 border border-white/10 ring-1 ring-black/5">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
                            <div className="flex items-center space-x-1">
                                <div className={`w-1 bg-white rounded-full ${isPlaying ? "animate-[bounce_0.6s_infinite]" : "h-1"}`}></div>
                                <div className={`w-1 bg-white rounded-full ${isPlaying ? "animate-[bounce_0.8s_infinite]" : "h-3"}`}></div>
                                <div className={`w-1 bg-white rounded-full ${isPlaying ? "animate-[bounce_0.7s_infinite]" : "h-2"}`}></div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden" onClick={() => togglePlay()}>
                            <div className="text-[var(--tg-theme-button-text-color)] font-black text-sm uppercase truncate leading-none mb-1">{currentTrack.title}</div>
                            <div className="text-[var(--tg-theme-button-text-color)]/70 text-xs font-bold uppercase truncate tracking-tighter">{currentTrack.artist}</div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                            className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                        >
                            {isPlaying ? (
                                <svg className="w-6 h-6 text-[var(--tg-theme-button-color)]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-[var(--tg-theme-button-color)]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
