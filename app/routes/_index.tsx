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

    let tgUser;

    // DEV MODE: Bypass auth if initData is missing in development
    if (!initData && process.env.NODE_ENV === "development") {
        console.log("DEV MODE: Using mock user for local testing");
        tgUser = {
            id: process.env.DEBUG_USER_ID || "12345678",
            username: "dev_user"
        };
    } else {
        if (!initData) return { error: "Missing initData" };
        tgUser = validateTelegramInitData(initData, process.env.TELEGRAM_BOT_TOKEN!);
    }

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
                include: {
                    songs: {
                        where: { isAvailable: true },
                        orderBy: { id: "desc" }
                    }
                }
            }
        }
    });

    // DEV MODE: Inject mock data if no active channel exists
    if (process.env.NODE_ENV === "development" && (!user.channels || !user.channels.isActive || user.channels.songs.length === 0)) {
        console.log("DEV MODE: Injecting mock songs and forcing active state");
        (user as any).channels = {
            id: -1,
            tgChatId: "mock_chat",
            isActive: true,
            isVerified: true,
            songs: [
                {
                    id: -1,
                    fileId: "mock_id_1",
                    title: "Stargazing (Mock)",
                    artist: "Myles Smith",
                    duration: 172,
                    thumbnailId: null,
                    isAvailable: true
                },
                {
                    id: -2,
                    fileId: "mock_id_2",
                    title: "Grace (Mock)",
                    artist: "Michael W. Smith",
                    duration: 246,
                    thumbnailId: null,
                    isAvailable: true
                }
            ]
        };
    }

    return { user };
}

export default function Home() {
    const fetcher = useFetcher<typeof action>();
    const [showSplash, setShowSplash] = useState(true);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const setPlaylist = useAudioStore((s: any) => s.setPlaylist);

    useEffect(() => {
        if (fetcher.data?.user?.channels?.songs) {
            setPlaylist(fetcher.data.user.channels.songs);
        }
    }, [fetcher.data, setPlaylist]);

    useEffect(() => {
        // Hide splash after 2s (slightly faster for dev)
        const timer = setTimeout(() => setShowSplash(false), 2000);

        // Authenticate with Telegram
        const initPayload = async () => {
            if (hasInitialized) return;

            try {
                const WebApp = (await import("@twa-dev/sdk")).default;

                if (WebApp.initData) {
                    fetcher.submit({ initData: WebApp.initData }, { method: "post" });
                    setHasInitialized(true);
                } else if (import.meta.env.DEV) {
                    // AUTO-LOGIN on Localhost
                    console.log("Localhost detected: Submitting mock auth...");
                    fetcher.submit({}, { method: "post" }); // Submit empty to trigger dev bypass in action
                    setHasInitialized(true);
                }
            } catch (e) {
                if (import.meta.env.DEV) {
                    fetcher.submit({}, { method: "post" });
                    setHasInitialized(true);
                }
                console.error("Auth initialization failed", e);
            }
        };

        initPayload();
        return () => clearTimeout(timer);
    }, [fetcher, hasInitialized]);

    // Loading state
    if (showSplash || fetcher.state === "submitting" || (fetcher.state === "idle" && !fetcher.data)) {
        return <SplashScreen />;
    }

    const user = fetcher.data?.user;
    const channel = user?.channels;

    // Handle case where auth failed or wasn't attempted (non-Telegram production)
    if ((!fetcher.data || fetcher.data.error) && !import.meta.env.DEV) {
        return (
            <div className="p-10 text-center space-y-4">
                <h1 className="text-xl font-bold">Please open in Telegram</h1>
                <p className="text-sm text-[var(--tg-theme-hint-color)]">This app only works inside Telegram.</p>
                <div className="pt-8">
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] rounded-xl">Retry</button>
                </div>
            </div>
        );
    }

    if (!channel || !channel.isActive) {
        return <OnboardingPage
            isChecking={isChecking}
            onConnect={async () => {
                setIsChecking(true);
                const WebApp = (await import("@twa-dev/sdk")).default;
                fetcher.submit(
                    { initData: WebApp.initData },
                    { method: "post" }
                );
                // Reset checking state after a delay if it doesn't transition
                setTimeout(() => setIsChecking(false), 3000);
            }}
        />;
    }

    return <MusicPlayerPage user={user} channel={channel} />;
}
