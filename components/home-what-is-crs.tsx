"use client";

import Image from "next/image";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HomeWhatIsCrs() {
  return (
    <section
      aria-label="What is CRS?"
      className="bg-background px-6 py-24 md:px-10 md:py-32 lg:px-12"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="order-2 lg:order-1"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[1.5rem] border border-[#F2F0EF]/10 bg-[#F2F0EF] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] md:rounded-[1.75rem] lg:mx-0 lg:max-w-none">
            <Image
              src="/images/crs-emblem.png"
              alt="Collegiate Racing Series emblem"
              fill
              className="object-contain object-center p-8 md:p-10 lg:p-12"
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
          className="order-1 lg:order-2"
        >
          <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-tight text-[#F2F0EF] leading-[1.05]">
            What is CRS?
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#F2F0EF]/65 md:mt-8 md:text-lg">
            CRS stands for Collegiate Racing Series — a fully structured,
            student-led motorsport organization where engineering, driving, pit
            crew, media, and ops work as one race team. From the shop floor to
            race weekend, every role shares the same goal: build, learn, and
            compete together.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
