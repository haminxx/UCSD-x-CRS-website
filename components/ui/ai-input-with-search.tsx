"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** ~3 lines of `leading-relaxed` text before the textarea scrolls. */
const MAX_TEXTAREA_LINES = 3;

type AIInputWithSearchProps = {
  className?: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
};

export function AIInputWithSearch({
  className,
  placeholder = "Ask about joining the team…",
  onSubmit,
}: AIInputWithSearchProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const styles = window.getComputedStyle(el);
    const lineHeight = Number.parseFloat(styles.lineHeight);
    const fontSize = Number.parseFloat(styles.fontSize);
    const resolvedLine =
      Number.isFinite(lineHeight) && lineHeight > 0
        ? lineHeight
        : fontSize * 1.625;
    const maxHeight = resolvedLine * MAX_TEXTAREA_LINES;

    const contentHeight = el.scrollHeight;
    el.style.height = `${Math.min(contentHeight, maxHeight)}px`;
    el.style.overflowY = contentHeight > maxHeight ? "auto" : "hidden";
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setValue("");
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[1.15rem] border border-black/10 bg-[#F5F0E6]",
        "shadow-[0_14px_44px_-18px_rgba(10,18,24,0.3),0_2px_8px_-4px_rgba(10,18,24,0.12)]",
        className,
      )}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        className={cn(
          "block w-full resize-none overflow-y-hidden bg-transparent",
          "px-5 pb-3.5 pt-5 text-base leading-relaxed text-[#0a1218]",
          "outline-none placeholder:text-black/35",
          "sm:px-6 sm:pt-[1.35rem] sm:text-[1.05rem]",
        )}
        aria-label="Ask a recruitment question"
      />

      <div className="flex items-center justify-end gap-3 px-3.5 pb-3.5 sm:px-4 sm:pb-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!value.trim()}
          aria-label="Send message"
          className={cn(
            "inline-flex size-10 touch-manipulation items-center justify-center rounded-full transition",
            value.trim()
              ? "bg-[#0a1218] text-[#F5F0E6] hover:bg-black"
              : "bg-black/[0.06] text-black/30",
          )}
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
