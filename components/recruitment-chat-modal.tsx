"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, X } from "lucide-react";
import { getCookie, setCookie } from "@/lib/cookies";
import { cn } from "@/lib/utils";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

const COOKIE_KEY = "crs_recruitment_chat_v1";
const MAX_MESSAGES = 40;
const MAX_COOKIE_CHARS = 3500;

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadMessages(): ChatMessage[] {
  try {
    const raw = getCookie(COOKIE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m) =>
        m &&
        typeof m.id === "string" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    );
  } catch {
    return [];
  }
}

function persistMessages(messages: ChatMessage[]) {
  const trimmed = messages.slice(-MAX_MESSAGES);
  let payload = JSON.stringify(trimmed);
  while (payload.length > MAX_COOKIE_CHARS && trimmed.length > 2) {
    trimmed.shift();
    payload = JSON.stringify(trimmed);
  }
  setCookie(COOKIE_KEY, payload, 30);
}

/**
 * Stub assistant — replace with real LLM API later.
 * Keep signature async so the call site can swap to fetch() cleanly.
 */
async function stubAssistantReply(
  userText: string,
  history: ChatMessage[],
): Promise<string> {
  void history;
  await new Promise((r) => setTimeout(r, 450 + Math.random() * 350));

  const lower = userText.toLowerCase();
  if (/(driver|drive|racing)/.test(lower)) {
    return "Drivers train race craft and consistency for Collegiate Racing Series weekends. Tell me your experience level (none / karting / track) and I’ll point you to the right next step. (Stub reply — API not wired yet.)";
  }
  if (/(engineer|engineering|aero|chassis)/.test(lower)) {
    return "Engineering covers chassis, powertrain, aero, and systems on the car. Share your major or skills and what you want to work on first. (Stub reply — API not wired yet.)";
  }
  if (/(pit|crew)/.test(lower)) {
    return "Pit crew runs timed stops — tires, fuel, safety checks. No prior experience required if you’re ready to drill. Ask about tryouts or practice nights. (Stub reply — API not wired yet.)";
  }
  if (/(media|content|ops|operation)/.test(lower)) {
    return "Media, content, and ops keep race weekends and sponsors moving. Say which lane interests you and I’ll outline how to join. (Stub reply — API not wired yet.)";
  }
  if (/(join|apply|recruit|how)/.test(lower)) {
    return "To join CRS: pick a role below, come to an info session, and talk to a lead. Ask about timelines, tryouts, or any role — I’m here to help. (Stub reply — API not wired yet.)";
  }
  return `Thanks for asking about CRS. I can help with roles (Driver, Engineer, PIT Crew, Media, Content, Ops), how to join, and what a season looks like. (Stub reply — API not wired yet.) You said: “${userText.slice(0, 120)}${userText.length > 120 ? "…" : ""}”`;
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-[#0a1218] text-white"
            : "bg-black/[0.05] text-[#0a1218]",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

type RecruitmentChatModalProps = {
  open: boolean;
  onClose: () => void;
  initialMessage?: string | null;
  seedKey?: number;
};

export function RecruitmentChatModal({
  open,
  onClose,
  initialMessage,
  seedKey = 0,
}: RecruitmentChatModalProps) {
  const titleId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const pendingInitial = useRef<string | null>(null);
  const lastSeedKey = useRef(-1);
  const busyRef = useRef(false);

  useEffect(() => {
    setMessages(loadMessages());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistMessages(messages);
  }, [messages, hydrated]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open, busy]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busyRef.current) return;

    busyRef.current = true;
    setBusy(true);
    setDraft("");

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    let historyForApi: ChatMessage[] = [];
    setMessages((prev) => {
      historyForApi = [...prev, userMsg];
      return historyForApi;
    });

    try {
      // Swap stubAssistantReply for a real LLM fetch later.
      const reply = await stubAssistantReply(trimmed, historyForApi);
      const assistantMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: reply,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (!open || !initialMessage?.trim()) return;
    if (lastSeedKey.current === seedKey) return;
    lastSeedKey.current = seedKey;
    pendingInitial.current = initialMessage;
  }, [open, initialMessage, seedKey]);

  useEffect(() => {
    if (!open || !hydrated || busy) return;
    const pending = pendingInitial.current;
    if (!pending) return;
    pendingInitial.current = null;
    void send(pending);
  }, [open, hydrated, busy, send]);

  const onSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    void send(draft);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Close chat"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex h-[min(78dvh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
              <div>
                <h2
                  id={titleId}
                  className="text-base font-semibold tracking-tight text-[#0a1218]"
                >
                  CRS recruitment
                </h2>
                <p className="mt-0.5 text-xs text-black/40">
                  Ask about roles, tryouts, and how to join
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex size-9 items-center justify-center rounded-full bg-black/[0.04] text-[#0a1218] transition hover:bg-black/[0.08]"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>

            <div
              ref={listRef}
              className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4"
            >
              {messages.length === 0 && !busy && (
                <p className="my-auto text-center text-sm text-black/40">
                  Ask anything about joining UCSD × CRS — drivers, engineers,
                  pit crew, media, and ops.
                </p>
              )}
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-black/[0.05] px-3.5 py-2.5 text-sm text-black/40">
                    Thinking…
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={onSubmit}
              className="border-t border-black/[0.06] px-3 py-3"
            >
              <div className="flex items-end gap-2 rounded-xl border border-black/10 bg-[#f7f8f9] px-3 py-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSubmit();
                    }
                  }}
                  placeholder="Continue the conversation…"
                  disabled={busy}
                  className="max-h-28 min-h-[2rem] flex-1 resize-none bg-transparent py-1.5 text-sm text-[#0a1218] outline-none placeholder:text-black/35"
                  aria-label="Chat message"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || busy}
                  aria-label="Send"
                  className={cn(
                    "mb-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full transition",
                    draft.trim() && !busy
                      ? "bg-[#0a1218] text-white hover:bg-black"
                      : "bg-black/[0.06] text-black/30",
                  )}
                >
                  <ArrowUp className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
