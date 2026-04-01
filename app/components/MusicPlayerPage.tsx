import { useAudioStore } from "~/store/audioStore";
import { Artwork } from "./Artwork";
import { FullPlayer } from "./FullPlayer";

export function MusicPlayerPage({ user, channel }: { user: any; channel: any }) {
    const {
        playlist,
        currentTrack,
        isPlaying,
        playTrack,
        togglePlay,
        isPlayerOpen,
        setIsPlayerOpen,
        shuffleAll
    } = useAudioStore();

    console.log("MusicPlayerPage Playlist:", playlist);

    return (
        <div className="relative min-h-screen bg-transparent">
            <div className="p-6 pb-32 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <header className="flex items-center justify-between pb-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tighter leading-none uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-[var(--tg-theme-link-color)] to-[var(--tg-theme-button-color)]">
                            Musichome
                        </h1>
                        <p className="text-[10px] text-[var(--tg-theme-hint-color)] font-black uppercase tracking-[0.2em] opacity-60">
                            {channel?.tgChatId || "Personal Library"}
                        </p>
                    </div>
                    {/* <div className="w-12 h-12 rounded-2xl bg-[var(--tg-theme-secondary-bg-color)] flex items-center justify-center border border-white/5 active:scale-95 transition-transform shadow-lg">
                        <svg className="w-6 h-6 text-[var(--tg-theme-link-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </div> */}
                </header>

                <section className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-[10px] font-black text-[var(--tg-theme-hint-color)] uppercase tracking-[0.25em]">Tracks ({playlist.length})</h2>
                        <button
                            onClick={shuffleAll}
                            className="text-[10px] font-black text-[var(--tg-theme-link-color)] uppercase tracking-widest hover:opacity-80"
                        >
                            Shuffle All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {playlist.length > 0 ? (
                            playlist.map((track) => (
                                <div
                                    key={track.id}
                                    onClick={() => playTrack(track)}
                                    className={`group flex items-center py-4 rounded-[2rem] transition-all cursor-pointer active:scale-[0.98]  ${currentTrack?.id === track.id
                                        ? "bg-white/8 backdrop-blur-[30px] backdrop-contrast-[1] text-[var(--tg-theme-button-text-color)] ring-1 ring-white/20 px-4 shadow-[0_15px_35px_rgba(36,161,222,0.2)]  "
                                        : " text-white"
                                        }`}
                                >
                                    <Artwork
                                        thumbnailId={track.thumbnailId}
                                        isPlaying={isPlaying && currentTrack?.id === track.id}
                                        size="md"
                                        className={currentTrack?.id === track.id ? "shadow-inner border-white/20" : ""}
                                    />

                                    <div className="ml-4 flex-1 overflow-hidden">
                                        <h3 className="font-bold text-base truncate leading-tight uppercase tracking-tight">{track.title}</h3>
                                        <p className={`text-[10px] truncate mt-0.5 font-black uppercase tracking-widest ${currentTrack?.id === track.id ? "opacity-70" : "text-[var(--tg-theme-hint-color)]"}`}>
                                            {track.artist}
                                        </p>
                                    </div>

                                    <div className={`text-[11px] font-black tabular-nums tracking-tighter ${currentTrack?.id === track.id ? "opacity-70" : "text-[var(--tg-theme-hint-color)]"}`}>
                                        {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : "0:00"}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-16 text-center space-y-6 bg-[var(--tg-theme-secondary-bg-color)]/30 rounded-[3rem] border-2 border-dashed border-white/5 backdrop-blur-sm">
                                <div className="w-20 h-20 bg-gradient-to-br from-[var(--tg-theme-hint-color)]/10 to-transparent rounded-full flex items-center justify-center mx-auto text-[var(--tg-theme-hint-color)]/20">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-[var(--tg-theme-text-color)] uppercase tracking-widest">Library Empty</p>
                                    <p className="text-[10px] font-bold text-[var(--tg-theme-hint-color)] uppercase tracking-tighter opacity-60">Upload some tracks to your channel</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {currentTrack && (
                    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-40">
                        <div
                            onClick={() => setIsPlayerOpen(true)}
                            className="pointer-events-auto h-20 bg-white/8 backdrop-blur-[30px] backdrop-contrast-[1] rounded-[2.5rem] flex items-center px-4 shadow-[0_25px_60px_rgba(0,0,0,0.3)] ring-1 ring-white/20 active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <Artwork thumbnailId={currentTrack.thumbnailId} isPlaying={isPlaying} size="md" className="ring-1 ring-white/10" />

                            <div className="ml-4 flex-1 overflow-hidden">
                                <div className="text-[var(--tg-theme-button-text-color)] font-black text-sm uppercase truncate tracking-tight">{currentTrack.title}</div>
                                <div className="text-[var(--tg-theme-button-text-color)]/60 text-[9px] font-black uppercase truncate tracking-[0.15em]">{currentTrack.artist}</div>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                className="flex-shrink-0 w-14 h-14 bg-white/8 backdrop-blur-[30px] backdrop-contrast-[1]  text-white rounded-3xl flex items-center justify-center shadow-xl active:scale-90 transition-transform"
                            >
                                {isPlaying ? (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isPlayerOpen && <FullPlayer />}
        </div>
    );
}
