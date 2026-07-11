"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type VideoHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const VIDEO_UI_HIDE =
  "[&::-webkit-media-controls]:hidden [&::-webkit-media-controls-start-playback-button]:hidden [&::-webkit-media-controls-enclosure]:hidden [&::-webkit-media-controls-overlay-play-button]:hidden [&::-webkit-media-controls-play-button]:hidden";

type BackgroundAutoplayVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "src"
> & {
  src: string;
};

function primeVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.controls = false;
  video.autoplay = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("x-webkit-airplay", "deny");
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("controlsList", "nodownload nofullscreen noremoteplayback");
  video.removeAttribute("controls");
}

/**
 * Muted background loop — aggressive mobile autoplay (iOS Safari first paint).
 * Uses direct `src` so the browser starts loading immediately.
 */
export function BackgroundAutoplayVideo({
  src,
  className,
  ...props
}: BackgroundAutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryTimerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    primeVideo(video);

    const tryPlay = () => {
      primeVideo(video);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          /* Autoplay policy — retries below */
        });
      }
    };

    tryPlay();

    const events = [
      "loadeddata",
      "canplay",
      "canplaythrough",
      "loadedmetadata",
      "playing",
    ] as const;

    for (const event of events) {
      video.addEventListener(event, tryPlay);
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    const onPageShow = () => tryPlay();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", tryPlay);

    let attempts = 0;
    retryTimerRef.current = window.setInterval(() => {
      if (video.paused && !video.ended) {
        tryPlay();
      }
      attempts += 1;
      if (attempts >= 12 || !video.paused) {
        if (retryTimerRef.current !== null) {
          window.clearInterval(retryTimerRef.current);
          retryTimerRef.current = null;
        }
      }
    }, 250);

    return () => {
      for (const event of events) {
        video.removeEventListener(event, tryPlay);
      }
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", tryPlay);
      if (retryTimerRef.current !== null) {
        window.clearInterval(retryTimerRef.current);
      }
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          primeVideo(video);
          void video.play().catch(() => undefined);
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden
      className={cn(
        "background-autoplay-video object-cover",
        VIDEO_UI_HIDE,
        className,
      )}
      {...props}
    />
  );
}
