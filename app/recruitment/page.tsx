"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Eye, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AIInputWithSearch } from "@/components/ui/ai-input-with-search";
import { BlurFade } from "@/components/ui/blur-fade";
import { DotPattern } from "@/components/ui/dot-pattern";
import { RecruitmentChatModal } from "@/components/recruitment-chat-modal";
import { FALL_2026_APPLICATION_URL } from "@/lib/recruitment";
import { cn } from "@/lib/utils";

type TeamRole = {
  id: string;
  title: string;
  image: string;
  accent: string;
};

const TEAM_ROLES: TeamRole[] = [
  {
    id: "driver",
    title: "Driver",
    image: "/images/recruitment/driver.png",
    accent: "#1a3a4a",
  },
  {
    id: "engineer",
    title: "Engineer",
    image: "/images/recruitment/engineer.png",
    accent: "#2a4a3a",
  },
  {
    id: "pit-crew",
    title: "PIT Crew",
    image: "/images/recruitment/pit-crew.png",
    accent: "#3a2a1a",
  },
  {
    id: "media-team",
    title: "Media Team",
    image: "/images/recruitment/media-team.png",
    accent: "#2a2a4a",
  },
  {
    id: "content-creator",
    title: "Content Creator",
    image: "/images/recruitment/content-creator.png",
    accent: "#3a1a2a",
  },
  {
    id: "operation-team",
    title: "Operation Team",
    image: "/images/recruitment/operation-team.png",
    accent: "#1a2a3a",
  },
];

function TeamRoleCard({
  role,
  index,
  onOpen,
}: {
  role: TeamRole;
  index: number;
  onOpen: (role: TeamRole) => void;
}) {
  return (
    <BlurFade delay={0.1 + index * 0.04} inView>
      <button
        type="button"
        onClick={() => onOpen(role)}
        className="group relative w-full touch-manipulation overflow-hidden rounded-[clamp(0.75rem,1.2vw,1rem)] text-left outline-none focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-label={`View ${role.title}`}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-[clamp(0.75rem,1.2vw,1rem)] bg-[#eef1f3]",
            "aspect-[3/4]",
            "min-h-[clamp(9.5rem,18vh,14rem)]",
            "sm:min-h-[clamp(11rem,20vh,16rem)]",
            "lg:min-h-[clamp(12rem,22vh,18rem)]",
            "xl:min-h-[clamp(13.5rem,24vh,20rem)]",
            "2xl:min-h-[clamp(15rem,26vh,22rem)]",
          )}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, ${role.accent} 0%, #0a1218 100%)`,
            }}
            aria-hidden="true"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={role.image}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-95"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

          <span
            className={cn(
              "absolute bottom-[clamp(0.5rem,1vw,0.75rem)] left-[clamp(0.5rem,1vw,0.75rem)] inline-flex items-center gap-1 overflow-hidden rounded-full",
              "bg-white/95 text-[#0a1218] shadow-sm backdrop-blur-sm",
              "max-w-7 transition-[max-width] duration-300 ease-out",
              "group-hover:max-w-[6.5rem]",
            )}
          >
            <span className="flex size-7 shrink-0 items-center justify-center sm:size-8">
              <Eye className="size-3.5 sm:size-4" aria-hidden="true" />
            </span>
            <span className="whitespace-nowrap pr-2.5 text-[10px] font-medium tracking-wide opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-xs">
              View
            </span>
          </span>
        </div>

        <p className="mt-[clamp(0.4rem,0.9vh,0.65rem)] text-center text-[clamp(0.7rem,1.15vw,0.95rem)] font-medium tracking-wide text-[#0a1218]">
          {role.title}
        </p>
      </button>
    </BlurFade>
  );
}

function TeamRoleModal({
  role,
  onClose,
}: {
  role: TeamRole | null;
  onClose: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!role) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [role, onClose]);

  return (
    <AnimatePresence>
      {role && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center px-3 py-6 sm:px-4 sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Close dialog"
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
            className={cn(
              "relative z-10 flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl",
              "max-h-[min(86dvh,36rem)] max-w-[min(94vw,42rem)]",
              "sm:max-h-[min(78dvh,28rem)] sm:max-w-[min(92vw,52rem)]",
              "md:max-h-[min(72dvh,30rem)] md:max-w-[min(90vw,58rem)]",
              "lg:max-h-[min(68dvh,32rem)] lg:max-w-[min(88vw,64rem)]",
              "sm:flex-row",
            )}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-[#0a1218] shadow-sm transition hover:bg-white sm:bg-black/[0.04] sm:shadow-none sm:hover:bg-black/[0.08]"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="relative h-[min(38vw,11rem)] w-full shrink-0 overflow-hidden bg-[#eef1f3] sm:h-auto sm:w-[42%] sm:max-w-[20rem] lg:w-[40%]">
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(160deg, ${role.accent} 0%, #0a1218 100%)`,
                }}
                aria-hidden="true"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={role.image}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-black/[0.06] px-5 pb-5 pt-4 sm:border-t-0 sm:border-l sm:px-7 sm:pb-7 sm:pt-6">
              <h2
                id={titleId}
                className="pr-10 text-xl font-semibold tracking-tight text-[#0a1218] sm:text-2xl"
              >
                {role.title}
              </h2>
              <p className="mt-1.5 text-xs text-black/40 sm:text-sm">
                Role overview — details coming soon
              </p>
              <div
                className="mt-4 min-h-[6.5rem] flex-1 rounded-xl border border-dashed border-black/10 bg-[#f7f8f9] sm:mt-5 sm:min-h-[8rem]"
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function RecruitmentPage() {
  const [selected, setSelected] = useState<TeamRole | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSeed, setChatSeed] = useState<string | null>(null);
  const [chatSeedKey, setChatSeedKey] = useState(0);

  const openChat = (message: string) => {
    setChatSeed(message);
    setChatSeedKey((k) => k + 1);
    setChatOpen(true);
  };

  return (
    <>
      <SiteHeader />
      <main className="relative overflow-x-clip bg-white text-[#0a1218]">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
        >
          <DotPattern
            className="opacity-40 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_20%,black,transparent)]"
            width={18}
            height={18}
            cr={1}
          />
        </div>

        {/* Three groups with even vertical rhythm across the viewport */}
        <div
          className={cn(
            "relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[110rem] flex-col",
            "justify-evenly",
            "px-4 sm:px-6 md:px-10 lg:px-12 xl:px-[clamp(1.5rem,4vw,3.5rem)]",
          )}
          style={{
            paddingTop: "clamp(5.25rem, 9vh, 7.5rem)",
            paddingBottom: "clamp(1.25rem, 3vh, 2.75rem)",
            gap: "clamp(1.25rem, 3.5vh, 2.75rem)",
          }}
        >
          {/* Group 1 — Headline + CTA */}
          <section className="flex shrink-0 flex-col items-center text-center">
            <BlurFade delay={0.05}>
              <h1
                className={cn(
                  "text-balance font-bold text-[#0a1218]",
                  "text-[clamp(2.75rem,6.5vw,5.25rem)]",
                  "leading-[1.05] tracking-[-0.04em]",
                )}
              >
                Join the team.
              </h1>
            </BlurFade>

            <BlurFade delay={0.1} className="mt-[clamp(1rem,2.4vh,1.75rem)]">
              <a
                href={FALL_2026_APPLICATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full bg-[#0a1218]",
                  "px-[clamp(1.25rem,2vw,1.75rem)] py-[clamp(0.65rem,1.2vh,0.85rem)]",
                  "text-[clamp(0.875rem,1.1vw,1rem)] font-medium tracking-wide text-white",
                  "shadow-[0_10px_28px_-14px_rgba(10,18,24,0.55),0_2px_6px_-2px_rgba(10,18,24,0.2)]",
                  "transition hover:bg-black focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2",
                  "touch-manipulation",
                )}
              >
                Fall 2026 Application
                <ArrowUpRight className="size-4 opacity-80" aria-hidden="true" />
              </a>
            </BlurFade>
          </section>

          {/* Group 2 — Ask line + chatbox */}
          <section className="mx-auto flex w-full max-w-[min(100%,42rem)] shrink-0 flex-col items-center text-center xl:max-w-[min(100%,48rem)]">
            <BlurFade delay={0.14}>
              <p className="text-[clamp(0.9rem,1.35vw,1.125rem)] text-black/55">
                Feel free to ask me any question
              </p>
            </BlurFade>

            <BlurFade
              delay={0.2}
              className="mt-[clamp(0.75rem,1.8vh,1.25rem)] w-full"
            >
              <AIInputWithSearch
                onSubmit={(value) => {
                  openChat(value);
                }}
              />
            </BlurFade>
          </section>

          {/* Group 3 — Role / team cards */}
          <section className="w-full shrink-0">
            <div
              className={cn(
                "mx-auto grid w-full",
                "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
                "gap-[clamp(0.55rem,1.4vw,1.15rem)]",
              )}
            >
              {TEAM_ROLES.map((role, index) => (
                <TeamRoleCard
                  key={role.id}
                  role={role}
                  index={index}
                  onOpen={setSelected}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <TeamRoleModal role={selected} onClose={() => setSelected(null)} />
      <RecruitmentChatModal
        open={chatOpen}
        initialMessage={chatSeed}
        seedKey={chatSeedKey}
        onClose={() => {
          setChatOpen(false);
          setChatSeed(null);
        }}
      />
      <SiteFooter />
    </>
  );
}
