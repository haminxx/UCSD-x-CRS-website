"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eye, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AIInputWithSearch } from "@/components/ui/ai-input-with-search";
import { BlurFade } from "@/components/ui/blur-fade";
import { DotPattern } from "@/components/ui/dot-pattern";
import { RecruitmentChatModal } from "@/components/recruitment-chat-modal";
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
    image: "https://picsum.photos/seed/crs-driver/600/900",
    accent: "#1a3a4a",
  },
  {
    id: "engineer",
    title: "Engineer",
    image: "https://picsum.photos/seed/crs-engineer/600/900",
    accent: "#2a4a3a",
  },
  {
    id: "pit-crew",
    title: "PIT Crew",
    image: "https://picsum.photos/seed/crs-pit/600/900",
    accent: "#3a2a1a",
  },
  {
    id: "media-team",
    title: "Media Team",
    image: "https://picsum.photos/seed/crs-media/600/900",
    accent: "#2a2a4a",
  },
  {
    id: "content-creator",
    title: "Content Creator",
    image: "https://picsum.photos/seed/crs-content/600/900",
    accent: "#3a1a2a",
  },
  {
    id: "operation-team",
    title: "Operation Team",
    image: "https://picsum.photos/seed/crs-ops/600/900",
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
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#eef1f3] lg:aspect-[2/3]">
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

        <p className="mt-2 text-center text-[11px] font-medium tracking-wide text-[#0a1218] sm:text-xs md:text-[0.8rem]">
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
          className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8"
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
            className="relative z-10 flex max-h-[min(90dvh,720px)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-[#0a1218] shadow-sm transition hover:bg-white"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="relative aspect-[2/3] max-h-[52%] w-full shrink-0 overflow-hidden bg-[#eef1f3]">
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

            <div className="flex min-h-0 flex-1 flex-col px-6 pb-6 pt-5">
              <h2
                id={titleId}
                className="text-xl font-semibold tracking-tight text-[#0a1218]"
              >
                {role.title}
              </h2>
              <div
                className="mt-4 min-h-[7.5rem] flex-1 rounded-xl border border-dashed border-black/10 bg-[#f7f8f9]"
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

        <section className="relative z-10 px-6 pb-5 pt-28 md:px-10 md:pb-6 md:pt-32 lg:px-16 lg:pt-36">
          <div className="mx-auto max-w-3xl text-center">
            <BlurFade delay={0.05}>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-[#0a1218] md:text-5xl lg:text-6xl">
                Join the team
              </h1>
            </BlurFade>
            <BlurFade delay={0.12}>
              <p className="mt-3 text-sm text-black/55 md:text-base">
                Feel free to ask me any question
              </p>
            </BlurFade>

            <BlurFade delay={0.2} className="mx-auto mt-6 max-w-xl md:mt-8">
              <AIInputWithSearch
                onSubmit={(value) => {
                  openChat(value);
                }}
              />
            </BlurFade>
          </div>
        </section>

        <section className="relative z-10 px-4 pb-16 pt-2 md:px-8 md:pb-20 md:pt-3 lg:px-12">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-6 lg:gap-4">
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
