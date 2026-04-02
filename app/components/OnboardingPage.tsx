import { useState } from "react";

export function OnboardingPage({ onConnect, isChecking = false }: { onConnect: () => void, isChecking?: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] p-6 text-center space-y-12 animate-in fade-in duration-1000">
            <div className="space-y-4">
                <h1 className="text-3xl text-white tracking-tight">Connect your channel</h1>
                <p className="text-[var(--tg-theme-hint-color)]">
                    Follow these simple steps to start playing your music.
                </p>
            </div>

            <div className="w-full max-w-md space-y-4">
                {[
                    { step: 1, title: "Create a Channel", desc: "Create a private Telegram channel for your music library." },
                    { step: 2, title: "Add @shenkzmusic_bot", desc: " Add @shenkzmusic_bot as an administrator to your channel" },
                    { step: 3, title: "Upload Music", desc: "Upload your favorite MP3 files to your new channel." },
                ].map((item) => (
                    <div key={item.step} className="flex items-start space-x-4 p-5 bg-white/8 backdrop-blur-[30px] backdrop-contrast-[1] rounded-3xl border border-[var(--tg-theme-hint-color)]/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 rounded-full bg-[var(--tg-theme-button-color)] flex items-center justify-center text-[var(--tg-theme-button-text-color)] font-bold shrink-0">
                            {item.step}
                        </div>
                        <div className="text-left space-y-1">
                            <h3 className="font-bold text-lg text-white leading-none">{item.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full max-w-md pt-4">
                <button
                    onClick={onConnect}
                    disabled={isChecking}
                    className="w-full py-5 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-black text-lg rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ring-4 ring-[var(--tg-theme-button-color)]/10 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                >
                    {isChecking ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-5 h-5 border-4 border-[var(--tg-theme-button-text-color)] border-t-transparent rounded-full animate-spin"></span>
                            Checking...
                        </span>
                    ) : "I've added the bot"}
                </button>
                <p className="mt-4 text-xs text-[var(--tg-theme-hint-color)] uppercase tracking-widest font-bold">
                    The bot will  detect your channel
                </p>
            </div>
        </div>
    );
}
