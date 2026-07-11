"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
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

function isPhoneView() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  );
}

function primeVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("x-webkit-airplay", "deny");
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  video.setAttribute(
    "controlsList",
    "nodownload nofullscreen noremoteplayback",
  );
}

/** Programmatic tap at the native overlay play target (center of video). */
function simulatePlayButtonTap(video: HTMLVideoElement) {
  const rect = video.getBoundingClientRect();
  const clientX = rect.left + rect.width / 2;
  const clientY = rect.top + rect.height / 2;

  const pointerInit: PointerEventInit = {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
    pointerId: 1,
    pointerType: "touch",
    isPrimary: true,
  };

  const mouseInit: MouseEventInit = {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
    view: window,
  };

  try {
    video.dispatchEvent(new PointerEvent("pointerdown", pointerInit));
    video.dispatchEvent(new PointerEvent("pointerup", pointerInit));
  } catch {
    /* PointerEvent unsupported */
  }

  video.dispatchEvent(new MouseEvent("mousedown", mouseInit));
  video.dispatchEvent(new MouseEvent("mouseup", mouseInit));
  video.dispatchEvent(new MouseEvent("click", mouseInit));

  try {
    const touch = {
      identifier: 1,
      target: video,
      clientX,
      clientY,
      pageX: clientX + window.scrollX,
      pageY: clientY + window.scrollY,
      screenX: clientX,
      screenY: clientY,
      radiusX: 1,
      radiusY: 1,
      rotationAngle: 0,
      force: 1,
    } as Touch;

    video.dispatchEvent(
      new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: true,
        touches: [touch],
        targetTouches: [touch],
        changedTouches: [touch],
      }),
    );
    video.dispatchEvent(
      new TouchEvent("touchend", {
        bubbles: true,
        cancelable: true,
        touches: [],
        targetTouches: [],
        changedTouches: [touch],
      }),
    );
  } catch {
    /* TouchEvent unsupported */
  }

  video.click();
}

async function forceMobilePlayback(video: HTMLVideoElement) {
  primeVideo(video);

  const tryPlay = async () => {
    primeVideo(video);
    try {
      await video.play();
      return !video.paused;
    } catch {
      return false;
    }
  };

  if (await tryPlay()) return true;

  simulatePlayButtonTap(video);
  if (await tryPlay()) return true;

  video.controls = true;
  simulatePlayButtonTap(video);
  if (await tryPlay()) {
    video.controls = false;
    return true;
  }

  video.controls = false;
  return !video.paused;
}

/**
 * Muted background loop — on phone view, programmatically taps the native play
 * overlay when autoplay alone does not start playback (iOS Safari).
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

    const phone = isPhoneView();
    primeVideo(video);
    video.controls = false;

    const markPlaying = () => {
      if (!video.paused) {
        setIsPlaying(true);
        video.controls = false;
      }
    };

    const bootstrap = async () => {
      if (phone) {
        await forceMobilePlayback(video);
      } else {
        try {
          await video.play();
        } catch {
          /* desktop retry via events */
        }
      }
      markPlaying();
    };

    void bootstrap();

    const onMediaEvent = () => {
      markPlaying();
      if (video.paused && phone) {
        void forceMobilePlayback(video).then(markPlaying);
      } else if (video.paused) {
        void video.play().catch(() => undefined);
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
        if (phone) {
          void forceMobilePlayback(video).then(markPlaying);
        } else {
          void video.play().catch(() => undefined);
        }
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
        if (isPhoneView()) {
          void forceMobilePlayback(video).then(() => {
            if (!video.paused) setIsPlaying(true);
          });
        } else {
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
