"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  OrbitCardStack,
  type OrbitStackItem,
} from "@/components/ui/orbit-card-stack";
import { Button } from "@/components/ui/button";
import { PageEnter } from "@/components/page-motion";
import { cn } from "@/lib/utils";

const orbitLeaders: OrbitStackItem[] = [
  {
    name: "Rhea Sheth",
    role: "Co-Lead",
    description:
      "Guides the Technical Research team with clear priorities and a high bar for craft.",
    accent: "#f8d66d",
    initials: "RS",
    stat: "TR",
  },
  {
    name: "Nika Sabouri",
    role: "Co-Lead",
    description:
      "Keeps SEDS aligned, moving fast, and focused on what matters for the season.",
    accent: "#78dcca",
    initials: "NS",
    stat: "SEDS",
  },
  {
    name: "Anusha Rao",
    role: "Mentor",
    description:
      "Supports drivers and engineers with calm guidance when the pressure is highest.",
    accent: "#f3f1ea",
    initials: "AR",
    stat: "TR",
  },
  {
    name: "Sophie Phung",
    role: "Mentor",
    description:
      "Helps the team turn ideas into clean execution across builds and race weekends.",
    accent: "#b9a7ff",
    initials: "SP",
    stat: "TR",
  },
  {
    name: "Ezra Moon",
    role: "Operations",
    description:
      "Keeps logistics quiet, handoffs clean, and the whole crew moving without friction.",
    accent: "#ff9d77",
    initials: "EM",
    stat: "Ops",
  },
];

const teamFilters = [
  "Driver",
  "Engineer",
  "PIT Crew",
  "Media Team",
  "Content Creator",
  "Operation Team",
] as const;

type TeamFilter = (typeof teamFilters)[number];

type TeamMember = {
  name: string;
  role: string;
  team: string;
  filter: TeamFilter;
  image?: string;
};

const teamMembers: TeamMember[] = [
  {
    name: "Rhea Sheth",
    role: "Co-Lead",
    team: "TR",
    filter: "Engineer",
  },
  {
    name: "Nika Sabouri",
    role: "Co-Lead",
    team: "SEDS",
    filter: "Operation Team",
  },
  {
    name: "Anusha Rao",
    role: "Mentor",
    team: "TR",
    filter: "Driver",
  },
  {
    name: "Sophie Phung",
    role: "Mentor",
    team: "TR",
    filter: "Engineer",
  },
  {
    name: "Alex Kim",
    role: "Driver",
    team: "TR",
    filter: "Driver",
  },
  {
    name: "Jordan Lee",
    role: "Systems Engineer",
    team: "SEDS",
    filter: "Engineer",
  },
  {
    name: "Casey Nguyen",
    role: "Pit Specialist",
    team: "TR",
    filter: "PIT Crew",
  },
  {
    name: "Morgan Patel",
    role: "Photographer",
    team: "Media",
    filter: "Media Team",
  },
  {
    name: "Riley Chen",
    role: "Videographer",
    team: "Media",
    filter: "Content Creator",
  },
  {
    name: "Sam Ortiz",
    role: "Ops Lead",
    team: "Ops",
    filter: "Operation Team",
  },
  {
    name: "Taylor Brooks",
    role: "Pit Crew",
    team: "TR",
    filter: "PIT Crew",
  },
  {
    name: "Jamie Park",
    role: "Content Lead",
    team: "Media",
    filter: "Content Creator",
  },
];

function MemberPortrait({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (member.image) {
    return (
      <img
        src={member.image}
        alt={member.name}
        className="aspect-square w-full object-cover"
      />
    );
  }

  return (
    <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-[#e8ecef] via-[#dfe4e8] to-[#d0d7dc] text-3xl font-semibold tracking-wide text-[#0a1218]/70">
      {initials}
    </div>
  );
}

function TeamProfileCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex flex-col items-center text-center">
      <div className="w-full overflow-hidden bg-[#eef1f3]">
        <MemberPortrait member={member} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-[#0a1218] md:text-xl">
        {member.name}
      </h3>
      <p className="mt-1.5 text-sm text-black/55 md:text-base">
        {member.role} ({member.team})
      </p>
    </article>
  );
}

export default function AboutUsPage() {
  const [headline, setHeadline] = useState("Meet our team!");
  const [activeFilter, setActiveFilter] = useState<TeamFilter>("Driver");

  const filteredMembers = teamMembers.filter(
    (member) => member.filter === activeFilter,
  );

  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip bg-white text-[#0a1218]">
        <PageEnter>
        <section className="relative z-0 px-6 pb-4 pt-32 md:pb-6 md:pt-40">
          <div className="mx-auto max-w-7xl text-center">
            <div className="relative mx-auto flex min-h-[5.5rem] items-center justify-center md:min-h-[7rem]">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={headline}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22 }}
                  className="max-w-5xl text-balance text-5xl font-semibold tracking-tight text-[#0a1218] md:text-7xl lg:text-8xl"
                >
                  {headline}
                </motion.h1>
              </AnimatePresence>
            </div>
          </div>

          <OrbitCardStack
            items={orbitLeaders}
            className="mt-2 md:mt-4"
            onActiveChange={(item) => setHeadline(item.name)}
            onCollapse={() => setHeadline("Meet our team!")}
          />
        </section>

        <section className="relative z-0 bg-white px-6 pb-28 pt-6 md:pt-8">
          <div className="mx-auto max-w-7xl">
            <div
              role="tablist"
              aria-label="Team filters"
              className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-black/10 bg-[#f4f6f7] p-2.5 md:gap-3"
            >
              {teamFilters.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <Button
                    key={filter}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "rounded-xl px-4 py-2 text-sm md:px-5",
                      isActive
                        ? "bg-[#0a1218] text-white hover:bg-black"
                        : "text-black/55 hover:bg-black/5 hover:text-black",
                    )}
                  >
                    {filter}
                  </Button>
                );
              })}
            </div>

            <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {filteredMembers.map((member) => (
                <TeamProfileCard
                  key={`${member.name}-${member.team}`}
                  member={member}
                />
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <p className="mt-14 text-center text-black/50">
                No members in this team yet.
              </p>
            )}
          </div>
        </section>
        </PageEnter>
      </main>
      <SiteFooter />
    </>
  );
}
