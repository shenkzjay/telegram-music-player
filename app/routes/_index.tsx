import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/_index";
import { validateTelegramInitData } from "~/utils/auth.server";
import { prisma } from "../../prisma/prisma"; // Adjust path to user's prisma.ts
import { SplashScreen } from "~/components/SplashScreen";
import { OnboardingPage } from "~/components/OnboardingPage";
import { MusicPlayerPage } from "~/components/MusicPlayerPage";
import { useAudioStore } from "~/store/audioStore";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const initData = formData.get("initData") as string;

    if (!initData) return { error: "Missing initData" };

    const tgUser = validateTelegramInitData(initData, process.env.TELEGRAM_BOT_TOKEN!);
    if (!tgUser) return { error: "Invalid auth" };

    // Upsert user in database
    const user = await prisma.user.upsert({
        where: { tgId: tgUser.id.toString() },
        update: { username: tgUser.username },
        create: {
            tgId: tgUser.id.toString(),
            username: tgUser.username,
        },
        include: {
            channels: {
                include: { songs: { orderBy: { id: "desc" } } }
            }
        }
    });

    return { user };
}

export default function Home() {
    const fetcher = useFetcher<typeof action>();
    const [showSplash, setShowSplash] = useState(true);
    const [hasInitialized, setHasInitialized] = useState(false);
    const setPlaylist = useAudioStore((s: any) => s.setPlaylist);

    useEffect(() => {
        if (fetcher.data?.user?.channels?.songs) {
            setPlaylist(fetcher.data.user.channels.songs);
        }
    }, [fetcher.data, setPlaylist]);

    useEffect(() => {
        // Hide splash after 2.5s
        const timer = setTimeout(() => setShowSplash(false), 2500);

        // Authenticate with Telegram
        const initPayload = async () => {
            try {
                const WebApp = (await import("@twa-dev/sdk")).default;
                if (WebApp.initData && !hasInitialized) {
                    fetcher.submit(
                        { initData: WebApp.initData },
                        { method: "post" }
                    );
                    setHasInitialized(true);
                } else if (!WebApp.initData && !hasInitialized) {
                    // Dev/Mocking mode: submit placeholder if not in Telegram
                    if (import.meta.env.DEV) {
                        console.log("Not in Telegram. Skipping auth for now.");
                        // We could submit mock data here if needed
                    }
                    setHasInitialized(true);
                }
            } catch (e) {
                console.error("Auth failed", e);
                setHasInitialized(true);
            }
        };

        initPayload();
        return () => clearTimeout(timer);
    }, [fetcher, hasInitialized]);

    // Loading state
    if (showSplash || fetcher.state === "submitting") {
        return <SplashScreen />;
    }

    // Handle case where auth failed or wasn't attempted (non-Telegram)
    // if (!fetcher.data || fetcher.data.error) {
    //     if (!showSplash) {
    //         return (
    //             <div className="p-10 text-center space-y-4">
    //                 <h1 className="text-xl font-bold">Please open in Telegram</h1>
    //                 <p className="text-sm text-[var(--tg-theme-hint-color)]">This app only works inside Telegram.</p>
    //                 {fetcher.data?.error && <pre className="text-xs text-red-500 italic mt-4">{fetcher.data.error}</pre>}
    //                 <div className="pt-8">
    //                     <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] rounded-xl">Retry</button>
    //                 </div>
    //             </div>
    //         );
    //     }
    //     return <SplashScreen />;
    // }

    const user = fetcher.data?.user;
    const channel = user?.channels;

    if (!channel) {
        return <OnboardingPage onConnect={() => {
            // Refresh or check again
            fetcher.submit({ initData: (window as any).Telegram.WebApp.initData }, { method: "post" });
        }} />;
    }

    return <MusicPlayerPage user={user} channel={channel} />;
}
