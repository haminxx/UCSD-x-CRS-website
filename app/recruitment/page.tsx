"use client";

import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageEnter } from "@/components/page-motion";

const JOIN_FORM_URL = "https://form.typeform.com/to/hQtOGGHW";

function FloralMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 6C24.8 12.4 27.6 16.8 34 18C27.6 19.2 24.8 23.6 24 30C23.2 23.6 20.4 19.2 14 18C20.4 16.8 23.2 12.4 24 6Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M24 14C24.5 18.2 26.4 21.1 30.5 22C26.4 22.9 24.5 25.8 24 30C23.5 25.8 21.6 22.9 17.5 22C21.6 21.1 23.5 18.2 24 14Z"
        fill="currentColor"
        opacity="0.55"
      />
      <circle cx="24" cy="22" r="2.25" fill="currentColor" />
    </svg>
  );
}

export default function RecruitmentPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-dvh overflow-hidden bg-white text-[#0a1218]">
        <div className="absolute inset-0" aria-hidden="true">
          <video
            className="absolute inset-0 size-full object-cover opacity-0"
            muted
            autoPlay
            loop
            playsInline
            // src="/videos/recruitment-hero.mp4"
          />
        </div>

        <section className="relative z-10 flex min-h-dvh flex-col justify-center px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40 lg:px-16">
          <PageEnter>
            <div className="mx-auto w-full max-w-7xl">
              <h1 className="flex flex-col items-center gap-5 text-center text-[clamp(2.25rem,6.5vw,5.5rem)] font-light leading-[1.05] tracking-tight md:flex-row md:items-center md:justify-between md:gap-8 md:text-left">
                <span className="md:max-w-[42%] md:flex-1">life is a creative</span>
                <FloralMark className="size-8 shrink-0 text-black/60 md:size-10 lg:size-12" />
                <span className="md:max-w-[42%] md:flex-1 md:text-right">
                  Join the team
                </span>
              </h1>

              <div className="mt-10 flex flex-col gap-9 md:mt-12 md:ml-auto md:max-w-[42%] md:gap-11">
                <div className="h-px w-16 bg-black/40 md:ml-auto" />

                <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
                  <p className="max-w-sm text-left text-sm leading-relaxed text-black/55 md:text-[0.95rem]">
                    Build, race, and grow with UCSD x CRS. Bring your craft to a
                    team that turns late nights into lap times — and purpose into
                    every mile.
                  </p>

                  <a
                    href={JOIN_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0a1218] px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-black"
                  >
                    JOIN US
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </PageEnter>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
