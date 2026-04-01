export function SplashScreen({ slogan = "Your music, your way." }: { slogan?: string }) {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-transparent animate-in fade-in duration-500">
            <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[var(--tg-theme-link-color)] to-[#24a1de] rounded-full opacity-25 blur-2xl group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative w-32 h-32 bg-[var(--tg-theme-button-color)] rounded-[2.5rem] flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500">
                    <svg className="w-16 h-16 text-[var(--tg-theme-button-text-color)]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                </div>
            </div>

            <div className="mt-12 space-y-3 text-center">
                <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-[var(--tg-theme-link-color)] to-[#24a1de] bg-clip-text text-transparent">
                    Musichome
                </h1>
                <p className="text-[var(--tg-theme-hint-color)] font-medium tracking-wide animate-pulse">
                    {slogan}
                </p>
            </div>

            <div className="absolute bottom-12 flex space-x-2">
                <div className="w-2 h-2 bg-[var(--tg-theme-button-color)] rounded-full animate-bounce delay-0"></div>
                <div className="w-2 h-2 bg-[var(--tg-theme-button-color)] rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-[var(--tg-theme-button-color)] rounded-full animate-bounce delay-200"></div>
            </div>
        </div>
    );
}
