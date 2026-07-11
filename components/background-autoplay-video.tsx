"use client";

import { useEffect, useRef, type VideoHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const VIDEO_UI_HIDE =
  "[&::-webkit-media-controls]:hidden [&::-webkit-media-controls-start-playback-button]:hidden [&::-webkit-media-controls-enclosure]:hidden [&::-webkit-media-controls-overlay-play-button]:hidden";

type BackgroundAutoplayVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "src"
> & {
  src: string;
};

/**
 * Muted background loop — same autoplay pattern as Login (works on iOS Safari).
 * Uses direct `src` (not <source>) so the browser starts loading from first paint.
 */
export function BackgroundAutoplayVideo({
  src,
  className,
  ...props
}: BackgroundAutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.controls = false;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("muted", "");

    const tryPlay = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          /* Autoplay policy — muted inline usually recovers on canplay */
        });
      }
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("loadedmetadata", tryPlay);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadedmetadata", tryPlay);
    };
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
      className={cn("background-autoplay-video object-cover", VIDEO_UI_HIDE, className)}
      {...props}
    />
  );
}
