import { create } from "zustand";

interface Track {
    id: number | string;
    fileId: string;
    title: string;
    artist: string;
    duration: number;
}

interface AudioState {
    isPlaying: boolean;
    currentTrack: Track | null;
    playlist: Track[];
    volume: number;

    // Actions
    setPlaylist: (tracks: Track[]) => void;
    playTrack: (track: Track) => void;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
    isPlaying: false,
    currentTrack: null,
    playlist: [],
    volume: 1,

    setPlaylist: (playlist) => set({ playlist }),

    playTrack: (track) => set({ currentTrack: track, isPlaying: true }),

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    nextTrack: () => {
        const { playlist, currentTrack } = get();
        if (!currentTrack || playlist.length === 0) return;
        const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        set({ currentTrack: playlist[nextIndex], isPlaying: true });
    },

    prevTrack: () => {
        const { playlist, currentTrack } = get();
        if (!currentTrack || playlist.length === 0) return;
        const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        set({ currentTrack: playlist[prevIndex], isPlaying: true });
    },

    setVolume: (volume) => set({ volume }),
}));
