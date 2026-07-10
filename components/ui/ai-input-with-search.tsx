"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type AIInputWithSearchProps = {
  className?: string;
  placeholder?: string;
  onSubmit?: (value: string, withSearch: boolean) => void;
};

export function AIInputWithSearch({
  className,
  placeholder = "Ask about joining the team…",
  onSubmit,
}: AIInputWithSearchProps) {
  const [value, setValue] = useState("");
  const [withSearch, setWithSearch] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed, withSearch);
    console.log("[recruitment chat]", { value: trimmed, withSearch });
    setValue("");
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[1.15rem] border border-black/10 bg-white",
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
        className="block w-full resize-none bg-transparent px-5 pb-3.5 pt-5 text-base leading-relaxed text-[#0a1218] outline-none placeholder:text-black/35 sm:px-6 sm:pt-[1.35rem] sm:text-[1.05rem]"
        aria-label="Ask a recruitment question"
      />

      <div className="flex items-center justify-between gap-3 px-3.5 pb-3.5 sm:px-4 sm:pb-4">
        <button
          type="button"
          onClick={() => setWithSearch((v) => !v)}
          aria-pressed={withSearch}
          className={cn(
            "inline-flex touch-manipulation items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium tracking-wide transition sm:text-[0.8125rem]",
            withSearch
              ? "bg-[#0a1218] text-white"
              : "bg-black/[0.04] text-black/55 hover:bg-black/[0.07] hover:text-black/80",
          )}
        >
          <Search className="size-3.5" aria-hidden="true" />
          Search
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!value.trim()}
          aria-label="Send message"
          className={cn(
            "inline-flex size-10 touch-manipulation items-center justify-center rounded-full transition",
            value.trim()
              ? "bg-[#0a1218] text-white hover:bg-black"
              : "bg-black/[0.06] text-black/30",
          )}
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
