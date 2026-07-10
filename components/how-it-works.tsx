"use client";

import { motion } from "motion/react";

const STEPS = [
  {
    num: "01",
    title: "Join & onboard",
    body: "Apply, meet the leads, and land in a role — driver, engineer, pit, media, or ops. You get the season calendar, shop norms, and a clear first assignment.",
  },
  {
    num: "02",
    title: "Train across roles",
    body: "Build nights, sim sessions, and crew drills stack real skills. Cross-train so you understand the car, the stop, and the weekend — not just your lane.",
  },
  {
    num: "03",
    title: "Race & deliver",
    body: "Compete in the Collegiate Racing Series with a full student-run program behind you. Execute the plan, learn from the data, and raise the bar next round.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      aria-label="How it works"
      className="bg-[#F5F0E6] px-4 pb-24 pt-8 md:px-8 md:pb-32 md:pt-12 lg:px-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#1a2229] px-8 py-14 text-[#F5F0E6] md:rounded-[2rem] md:px-12 md:py-20 lg:px-16 lg:py-24"
      >
        <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-bold tracking-tight uppercase leading-[0.95]">
          How it works
        </h2>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-10 lg:gap-14">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{
                duration: 0.65,
                delay: 0.08 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-sm tracking-wide text-[#F5F0E6]/40">
                  / {step.num}
                </span>
                <h3 className="text-xl font-semibold tracking-tight md:text-[1.35rem]">
                  {step.title}
                </h3>
              </div>
              <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-[#F5F0E6]/55 md:text-base">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
