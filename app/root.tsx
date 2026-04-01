import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useRef, useEffect } from "react";
import { useAudioStore } from "~/store/audioStore";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isPlaying, currentTrack, volume, nextTrack, setCurrentTime, currentTime, repeatMode, markUnavailable } = useAudioStore();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch((e: Error) => {
          if (e.name !== "AbortError") {
            console.error("Playback failed", e);
            if (currentTrack) markUnavailable(currentTrack.fileId);
          }
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, volume]);

  // Sync currentTime from store (e.g., seeking)
  useEffect(() => {
    if (audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 1) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleEnded = () => {
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      nextTrack();
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <Meta />
        <Links />
        <script src="https://telegram.org/js/telegram-web-app.js" defer></script>
      </head>
      <body
        style={{
          width: "100%",
          height: "100vh",
          color: "var(--tg-theme-text-color)",
          overflow: "hidden", // Prevent scrolling outside the app
        }}
        suppressHydrationWarning
      >
        <div className="h-full overflow-y-auto overflow-x-hidden">
          {children}
        </div>
        {currentTrack && (
          <audio
            ref={audioRef}
            src={`/api/stream/${currentTrack.fileId}`}
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
            onError={() => {
              if (currentTrack) {
                console.warn(`Audio error for track: ${currentTrack.title}`);
                markUnavailable(currentTrack.fileId);
              }
            }}
            preload="auto"
          />
        )}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    const initWebApp = async () => {
      try {
        const WebApp = (await import("@twa-dev/sdk")).default;
        WebApp.ready();
        WebApp.expand();
      } catch (e) {
        console.error("Failed to initialize Telegram WebApp SDK", e);
      }
    };

    initWebApp();
  }, []);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
