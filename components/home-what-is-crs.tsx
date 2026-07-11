"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES: {
  title: string;
  body: ReactNode;
}[] = [
  {
    title: "Join & onboard",
    body: (
      <>
        Apply, meet the leads, and land in a role:{" "}
        <strong className="font-semibold text-[#F2F0EF]">Driver</strong>,{" "}
        <strong className="font-semibold text-[#F2F0EF]">Engineer</strong>,{" "}
        <strong className="font-semibold text-[#F2F0EF]">PIT Crew</strong>,{" "}
        <strong className="font-semibold text-[#F2F0EF]">Media Team</strong>,{" "}
        <strong className="font-semibold text-[#F2F0EF]">Content Creator</strong>
        , or{" "}
        <strong className="font-semibold text-[#F2F0EF]">Operation Team</strong>.
      </>
    ),
  },
  {
    title: "Train across roles",
    body: (
      <>
        Build nights, sim sessions, and crew drills stack real skills so you
        know the car, the stop, and the weekend. You pick up industry-standard
        knowledge through hands-on prep—car setup, pit choreography, and
        race-day execution built for the{" "}
        <strong className="font-semibold text-[#F2F0EF]">
          Collegiate Racing Series
        </strong>
        .
      </>
    ),
  },
  {
    title: "Race & deliver",
    body: (
      <>
        Compete in the{" "}
        <strong className="font-semibold text-[#F2F0EF]">
          Collegiate Racing Series
        </strong>{" "}
        with a full student-run program behind you.
      </>
    ),
  },
];

export function HomeWhatIsCrs() {
  return (
    <section
      aria-label="What is CRS?"
      className="bg-background px-6 py-24 md:px-10 md:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.75, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-bold tracking-tight text-[#F2F0EF] leading-[1.05]">
            What is CRS?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#F2F0EF]/60 md:mt-5 md:text-lg">
            CRS is the{" "}
            <strong className="font-semibold text-[#F2F0EF]/85">
              Collegiate Racing Series
            </strong>
            , a{" "}
            <strong className="font-semibold text-[#F2F0EF]/85">
              student-led
            </strong>{" "}
            race team where{" "}
            <strong className="font-semibold text-[#F2F0EF]/85">Driver</strong>,{" "}
            <strong className="font-semibold text-[#F2F0EF]/85">
              Engineer
            </strong>
            ,{" "}
            <strong className="font-semibold text-[#F2F0EF]/85">
              PIT Crew
            </strong>
            ,{" "}
            <strong className="font-semibold text-[#F2F0EF]/85">
              Media Team
            </strong>
            ,{" "}
            <strong className="font-semibold text-[#F2F0EF]/85">
              Content Creator
            </strong>
            , and{" "}
            <strong className="font-semibold text-[#F2F0EF]/85">
              Operation Team
            </strong>{" "}
            compete as one.
          </p>
        </motion.div>

        <div className="mt-14 grid items-center gap-12 md:mt-16 lg:mt-20 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-[#F2F0EF] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] md:rounded-[1.75rem] lg:mx-0 lg:max-w-none">
              <Image
                src="/images/crs-emblem.png"
                alt="Collegiate Racing Series emblem"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 28rem, 36rem"
                priority={false}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
          >
            <h3 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-tight text-[#F2F0EF] leading-tight">
              How it works?
            </h3>

            <ol className="mt-10 space-y-8 md:mt-12 md:space-y-10">
              {FEATURES.map((feature, i) => (
                <motion.li
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5% 0px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + i * 0.08,
                    ease: EASE,
                  }}
                  className="flex gap-4 md:gap-5"
                >
                  <span
                    className="shrink-0 pt-0.5 text-lg font-bold tabular-nums tracking-tight text-[#F2F0EF] md:text-xl"
                    aria-hidden
                  >
                    {i + 1}.
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-lg font-bold tracking-tight text-[#F2F0EF] md:text-xl">
                      {feature.title}
                    </h4>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-[#F2F0EF]/55 md:text-base">
                      {feature.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
