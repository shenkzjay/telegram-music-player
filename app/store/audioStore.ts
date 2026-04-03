import { create } from "zustand";

interface Track {
    id: number | string;
    fileId: string;
    thumbnailId?: string | null;
    title: string;
    artist: string;
    duration: number;
}

interface AudioState {
    isPlaying: boolean;
    currentTrack: Track | null;
    playlist: Track[];
    volume: number;
    shuffle: boolean;
    repeatMode: 'none' | 'one' | 'all';
    currentTime: number;
    isPlayerOpen: boolean;

    // Actions
    setPlaylist: (tracks: Track[]) => void;
    playTrack: (track: Track) => void;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setVolume: (volume: number) => void;
    setShuffle: (shuffle: boolean) => void;
    setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
    setCurrentTime: (time: number) => void;
    setIsPlayerOpen: (isOpen: boolean) => void;
    shuffleAll: () => void;
    skipForward: () => void;
    skipBackward: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
    isPlaying: false,
    currentTrack: null,
    playlist: [],
    volume: 1,
    shuffle: false,
    repeatMode: 'none',
    currentTime: 0,
    isPlayerOpen: false,

    setPlaylist: (playlist) => set({ playlist }),

    playTrack: (track) => {
        // Force a small state update if it's the same track to ensure useEffect triggers
        const { currentTrack } = get();
        if (currentTrack?.id === track.id) {
            set({ currentTime: 0, isPlaying: true, isPlayerOpen: true });
        } else {
            set({ currentTrack: track, isPlaying: true, currentTime: 0, isPlayerOpen: true });
        }
    },

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),


    setShuffle: (shuffle) => set({ shuffle }),
    setRepeatMode: (repeatMode) => set({ repeatMode }),
    setCurrentTime: (currentTime) => set({ currentTime }),
    setIsPlayerOpen: (isPlayerOpen) => set({ isPlayerOpen }),

    shuffleAll: () => {
        const { playlist } = get();
        if (playlist.length === 0) return;
        const randomIndex = Math.floor(Math.random() * playlist.length);
        set({
            currentTrack: playlist[randomIndex],
            shuffle: true,
            isPlaying: true,
            currentTime: 0,
            isPlayerOpen: true
        });
    },

    skipForward: () => {
        const { currentTime, currentTrack } = get();
        if (!currentTrack) return;
        const newTime = Math.min(currentTime + 10, currentTrack.duration);
        set({ currentTime: newTime });
    },

    skipBackward: () => {
        const { currentTime } = get();
        const newTime = Math.max(currentTime - 10, 0);
        set({ currentTime: newTime });
    },

    nextTrack: () => {
        const { playlist, currentTrack, shuffle, repeatMode } = get();
        if (!currentTrack || playlist.length === 0) return;

        if (repeatMode === 'one') {
            // In audio element, this might need more than just setting store
            set({ currentTime: 0, isPlaying: true });
            return;
        }

        let nextIndex: number;
        if (shuffle) {
            // Find a random index that isn't the current one if possible
            if (playlist.length > 1) {
                const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
                do {
                    nextIndex = Math.floor(Math.random() * playlist.length);
                } while (nextIndex === currentIndex);
            } else {
                nextIndex = 0;
            }
        } else {
            const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
            nextIndex = currentIndex + 1;
            if (nextIndex >= playlist.length) {
                if (repeatMode === 'all') {
                    nextIndex = 0;
                } else {
                    set({ isPlaying: false });
                    return;
                }
            }
        }
        const nextTrackData = playlist[nextIndex];
        set({ currentTrack: nextTrackData, isPlaying: true, currentTime: 0 });
    },

    prevTrack: () => {
        const { playlist, currentTrack, currentTime } = get();
        if (!currentTrack || playlist.length === 0) return;

        // If simple click and more than 3s passed, just restart song
        if (currentTime > 3) {
            set({ currentTime: 0 });
            return;
        }

        const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        set({ currentTrack: playlist[prevIndex], isPlaying: true, currentTime: 0 });
    },

    setVolume: (volume) => set({ volume }),
}));
