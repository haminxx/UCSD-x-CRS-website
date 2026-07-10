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
        className="group relative w-full overflow-hidden rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-label={`View ${role.title}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#eef1f3] sm:aspect-[2/3] lg:aspect-[5/7] xl:aspect-[3/4] 2xl:aspect-[5/6]">
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
              "absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 overflow-hidden rounded-full",
              "bg-white/95 text-[#0a1218] shadow-sm backdrop-blur-sm",
              "max-w-7 transition-[max-width] duration-300 ease-out",
              "group-hover:max-w-[6.5rem]",
            )}
          >
            <span className="flex size-7 shrink-0 items-center justify-center">
              <Eye className="size-3.5" aria-hidden="true" />
            </span>
            <span className="whitespace-nowrap pr-2.5 text-[10px] font-medium tracking-wide opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              View
            </span>
          </span>
        </div>

        <p className="mt-1.5 text-center text-[11px] font-medium tracking-wide text-[#0a1218] sm:mt-2 sm:text-xs md:text-[0.8rem]">
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

        {/* One-screen composition on laptop/desktop: header + content before footer */}
        <div className="relative z-10 flex min-h-[100dvh] flex-col">
          <section
            className="flex flex-1 flex-col justify-center px-5 md:px-10 lg:px-16 xl:px-[clamp(2rem,6vw,5rem)]"
            style={{
              paddingTop: "clamp(5.5rem, 10vh, 8.5rem)",
              paddingBottom: "clamp(1rem, 2.5vh, 2rem)",
            }}
          >
            <div className="mx-auto w-full max-w-3xl text-center xl:max-w-4xl">
              <BlurFade delay={0.05}>
                <h1 className="text-balance text-[clamp(2.15rem,5.5vw,3.75rem)] font-semibold tracking-tight text-[#0a1218]">
                  Join the team.
                </h1>
              </BlurFade>

              <BlurFade delay={0.1} className="mt-[clamp(1.1rem,2.8vh,2rem)]">
                <div className="flex justify-center">
                  <a
                    href={FALL_2026_APPLICATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full bg-[#0a1218] px-5 py-2.5",
                      "text-sm font-medium tracking-wide text-white",
                      "shadow-[0_10px_28px_-14px_rgba(10,18,24,0.55)]",
                      "transition hover:bg-black focus-visible:outline-none",
                      "focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2",
                      "sm:px-6 sm:py-3 sm:text-[0.95rem]",
                    )}
                  >
                    Fall 2026 Application
                    <ArrowUpRight className="size-4 opacity-80" aria-hidden="true" />
                  </a>
                </div>
              </BlurFade>

              <BlurFade delay={0.16} className="mt-[clamp(1.35rem,3.2vh,2.35rem)]">
                <p className="text-sm text-black/55 md:text-base">
                  Feel free to ask me any question
                </p>
              </BlurFade>

              <BlurFade
                delay={0.22}
                className="mx-auto mt-[clamp(0.85rem,2vh,1.35rem)] w-full max-w-xl xl:max-w-2xl"
              >
                <AIInputWithSearch
                  onSubmit={(value) => {
                    openChat(value);
                  }}
                />
              </BlurFade>
            </div>
          </section>

          <section
            className="px-3 pb-[clamp(1.25rem,3vh,2.5rem)] md:px-8 lg:px-12 xl:px-[clamp(1.5rem,4vw,3rem)]"
            style={{
              paddingTop: "clamp(1.25rem, 3.5vh, 2.75rem)",
            }}
          >
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 md:gap-4 lg:grid-cols-6 lg:gap-3 xl:max-w-[90rem] xl:gap-3.5 2xl:max-w-[96rem] 2xl:gap-4">
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
