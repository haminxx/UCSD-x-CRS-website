"use client";

import { useEffect, useRef, type VideoHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const DESKTOP_SRC = "/videos/ucsdxcrs-v2.mp4";
const MOBILE_SRC = "/videos/ucsdxcrs-v2-mobile.mp4";
const POSTER = "/images/hero-poster.jpg";

type HeroBackgroundVideoProps = {
  className?: string;
};

/**
 * Full-bleed muted background video with mobile-safe autoplay and preload.
 * Picks a lighter mobile encode on narrow viewports.
 */
export function HeroBackgroundVideo({ className }: HeroBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const nextSrc = isMobile ? MOBILE_SRC : DESKTOP_SRC;

    // Swap source before play so phones don't download the larger file.
    const current = video.getAttribute("src") ?? "";
    if (!current.endsWith(nextSrc)) {
      video.setAttribute("src", nextSrc);
      video.load();
    }

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // iOS may block until a gesture; retry on first interaction.
        });
      }
    };

    tryPlay();

    const onReady = () => tryPlay();
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    const onFirstGesture = () => tryPlay();

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("touchstart", onFirstGesture, {
      once: true,
      passive: true,
    });
    window.addEventListener("click", onFirstGesture, { once: true });

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("touchstart", onFirstGesture);
      window.removeEventListener("click", onFirstGesture);
    };
  }, []);

  const videoProps: VideoHTMLAttributes<HTMLVideoElement> & {
    "webkit-playsinline"?: string;
  } = {
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true,
    preload: "auto",
    poster: POSTER,
    src: DESKTOP_SRC,
    "webkit-playsinline": "true",
    className: cn(
      "absolute inset-0 size-full object-cover object-center",
      className,
    ),
  };

  return <video ref={videoRef} {...videoProps} />;
}
