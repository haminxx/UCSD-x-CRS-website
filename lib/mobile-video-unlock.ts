/** Shared registry — unlock muted background videos after user gesture on phone view. */

const registeredVideos = new Set<HTMLVideoElement>();
let gestureListenersAttached = false;

export function isPhoneView() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  );
}

export function primeBackgroundVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("x-webkit-airplay", "deny");
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
}

export async function playBackgroundVideo(video: HTMLVideoElement) {
  primeBackgroundVideo(video);
  video.controls = false;
  try {
    await video.play();
  } catch {
    /* Retry on next gesture */
  }
  return !video.paused;
}

function allVideosPlaying() {
  if (registeredVideos.size === 0) return false;
  return [...registeredVideos].every((video) => !video.paused || video.ended);
}

async function unlockVideosFromGesture() {
  if (!isPhoneView()) return;

  for (const video of registeredVideos) {
    if (video.paused) {
      await playBackgroundVideo(video);
    }
  }

  if (allVideosPlaying()) {
    detachGestureUnlock();
  }
}

/** Call from nested scroll containers (e.g. contact snap scroller). */
export function unlockBackgroundVideosFromUserGesture() {
  void unlockVideosFromGesture();
}

function onGesture() {
  void unlockVideosFromGesture();
}

function attachGestureUnlock() {
  if (gestureListenersAttached || typeof document === "undefined") return;
  if (!isPhoneView()) return;

  gestureListenersAttached = true;

  const opts: AddEventListenerOptions = { passive: true, capture: true };

  document.addEventListener("touchstart", onGesture, opts);
  document.addEventListener("pointerdown", onGesture, opts);
  document.addEventListener("touchend", onGesture, opts);
  document.addEventListener("touchmove", onGesture, opts);
  window.addEventListener("scroll", onGesture, opts);
  document.addEventListener("scroll", onGesture, opts);
  window.addEventListener("wheel", onGesture, opts);
}

function detachGestureUnlock() {
  if (!gestureListenersAttached || typeof document === "undefined") return;

  gestureListenersAttached = false;

  document.removeEventListener("touchstart", onGesture, true);
  document.removeEventListener("pointerdown", onGesture, true);
  document.removeEventListener("touchend", onGesture, true);
  document.removeEventListener("touchmove", onGesture, true);
  window.removeEventListener("scroll", onGesture, true);
  document.removeEventListener("scroll", onGesture, true);
  window.removeEventListener("wheel", onGesture, true);
}

export function registerMobileBackgroundVideo(video: HTMLVideoElement) {
  registeredVideos.add(video);
  attachGestureUnlock();
}

export function unregisterMobileBackgroundVideo(video: HTMLVideoElement) {
  registeredVideos.delete(video);
  if (registeredVideos.size === 0) {
    detachGestureUnlock();
  }
}
