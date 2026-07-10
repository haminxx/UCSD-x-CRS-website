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
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
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
        "relative w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_40px_-18px_rgba(10,18,24,0.28)]",
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
        className="block w-full resize-none bg-transparent px-5 pb-3 pt-4 text-[0.95rem] leading-relaxed text-[#0a1218] outline-none placeholder:text-black/35"
        aria-label="Ask a recruitment question"
      />

      <div className="flex items-center justify-between gap-3 px-3 pb-3">
        <button
          type="button"
          onClick={() => setWithSearch((v) => !v)}
          aria-pressed={withSearch}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition",
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
            "inline-flex size-9 items-center justify-center rounded-full transition",
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
