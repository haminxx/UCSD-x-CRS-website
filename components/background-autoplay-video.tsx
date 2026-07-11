"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type VideoHTMLAttributes,
} from "react";
import {
  isPhoneView,
  playBackgroundVideo,
  primeBackgroundVideo,
  registerMobileBackgroundVideo,
  unregisterMobileBackgroundVideo,
} from "@/lib/mobile-video-unlock";
import { cn } from "@/lib/utils";

const VIDEO_UI_HIDE =
  "[&::-webkit-media-controls]:hidden [&::-webkit-media-controls-start-playback-button]:hidden [&::-webkit-media-controls-enclosure]:hidden [&::-webkit-media-controls-overlay-play-button]:hidden [&::-webkit-media-controls-play-button]:hidden";

type BackgroundAutoplayVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "src"
> & {
  src: string;
};

/**
 * Muted background loop. On phone view, playback also unlocks on first tap or
 * scroll anywhere on the page (user-gesture policy).
 */
export function BackgroundAutoplayVideo({
  src,
  className,
  ...props
}: BackgroundAutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryTimerRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    registerMobileBackgroundVideo(video);
    primeBackgroundVideo(video);
    video.controls = false;

    const markPlaying = () => {
      if (!video.paused) {
        setIsPlaying(true);
        video.controls = false;
      }
    };

    const bootstrap = async () => {
      await playBackgroundVideo(video);
      markPlaying();
    };

    void bootstrap();

    const onMediaEvent = () => {
      markPlaying();
      if (video.paused) {
        void playBackgroundVideo(video).then(markPlaying);
      }
    };

    const events = [
      "loadeddata",
      "canplay",
      "canplaythrough",
      "loadedmetadata",
      "playing",
      "play",
    ] as const;

    for (const event of events) {
      video.addEventListener(event, onMediaEvent);
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void bootstrap();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", () => void bootstrap());

    let attempts = 0;
    retryTimerRef.current = window.setInterval(() => {
      if (video.paused && !video.ended) {
        void playBackgroundVideo(video).then(markPlaying);
      } else {
        markPlaying();
      }

      attempts += 1;
      if (attempts >= 16 || !video.paused) {
        if (retryTimerRef.current !== null) {
          window.clearInterval(retryTimerRef.current);
          retryTimerRef.current = null;
        }
      }
    }, 300);

    return () => {
      unregisterMobileBackgroundVideo(video);
      for (const event of events) {
        video.removeEventListener(event, onMediaEvent);
      }
      document.removeEventListener("visibilitychange", onVisibility);
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
        if (!entry?.isIntersecting) return;
        void playBackgroundVideo(video).then(() => {
          if (!video.paused) setIsPlaying(true);
        });
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
      data-playing={isPlaying ? "true" : "false"}
      className={cn(
        "background-autoplay-video object-cover",
        isPlaying && VIDEO_UI_HIDE,
        className,
      )}
      {...props}
    />
  );
}
