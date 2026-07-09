"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SiteHeader } from "@/components/site-header";
import {
  OrbitCardStack,
  type OrbitStackItem,
} from "@/components/ui/orbit-card-stack";
import { Button } from "@/components/ui/button";
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
    <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 text-3xl font-semibold tracking-wide text-zinc-700">
      {initials}
    </div>
  );
}

function TeamProfileCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex flex-col items-center text-center">
      <div className="w-full overflow-hidden bg-zinc-100">
        <MemberPortrait member={member} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-zinc-950 md:text-xl">
        {member.name}
      </h3>
      <p className="mt-1 text-sm text-zinc-600 md:text-base">
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
      <main className="overflow-x-hidden bg-[#f7f5f0]">
        <section className="relative px-6 pb-10 pt-28 md:pt-36">
          <div className="mx-auto max-w-7xl text-center">
            <div className="relative mx-auto flex min-h-[5.5rem] items-center justify-center md:min-h-[7rem]">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={headline}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22 }}
                  className="max-w-5xl text-balance text-5xl font-semibold tracking-tight text-zinc-950 md:text-7xl lg:text-8xl"
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

        <section className="bg-[#f7f5f0] px-6 pb-24 pt-10">
          <div className="mx-auto max-w-7xl">
            <div
              role="tablist"
              aria-label="Team filters"
              className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-[#ebe8e1]/70 p-2 md:gap-3"
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
                      !isActive && "text-zinc-600 hover:text-zinc-950",
                    )}
                  >
                    {filter}
                  </Button>
                );
              })}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {filteredMembers.map((member) => (
                <TeamProfileCard key={`${member.name}-${member.team}`} member={member} />
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <p className="mt-12 text-center text-zinc-500">
                No members in this team yet.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
