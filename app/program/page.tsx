"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageEnter } from "@/components/page-motion";
import { SpringUnderline } from "@/components/spring-underline";
import { HoverPeek } from "@/components/ui/hover-peek";
import { LetterTitle } from "@/components/ui/background-paths";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

const CRS_URL = "https://drivecrs.com/";

const TRITON_MASK = "/images/triton-mask.png";

const tritonMaskStyle = {
  WebkitMaskImage: `url('${TRITON_MASK}')`,
  WebkitMaskSize: "min(72vw, 78vh)",
  WebkitMaskPosition: "center",
  WebkitMaskRepeat: "no-repeat",
  maskImage: `url('${TRITON_MASK}')`,
  maskSize: "min(72vw, 78vh)",
  maskPosition: "center",
  maskRepeat: "no-repeat",
} as const;

const GRID_CONFIG = {
  background: {
    color: "#64748b",
    maxOpacity: 0.12,
    flickerChance: 0.1,
    squareSize: 4,
    gridGap: 4,
  },
  triton: {
    color: "#182B49",
    maxOpacity: 0.55,
    flickerChance: 0.16,
    squareSize: 3,
    gridGap: 6,
  },
} as const;

export default function ProgramPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-[#F2F0EF] text-[#0a1218]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
        >
          <FlickeringGrid
            className="absolute inset-0 [mask-image:radial-gradient(900px_circle_at_center,white,transparent)] motion-safe:animate-pulse"
            {...GRID_CONFIG.background}
          />
          <div
            className="absolute inset-0 -translate-y-[6vh] motion-safe:animate-pulse md:translate-y-[1vh]"
            style={{
              ...tritonMaskStyle,
              animationDuration: "4s",
            }}
          >
            <FlickeringGrid {...GRID_CONFIG.triton} />
          </div>
        </div>

        <PageEnter>
          <section className="relative z-10 flex min-h-dvh items-center justify-center px-6 pb-24 pt-32 md:px-10 md:pb-28 md:pt-36 lg:px-16">
            <div className="mx-auto flex max-w-4xl translate-y-8 flex-col items-center text-center md:translate-y-12 lg:translate-y-16">
              <LetterTitle
                title="Coming Soon"
                className="text-[clamp(2.75rem,12vw,6.75rem)] md:text-[clamp(1.65rem,6.5vw,6.75rem)]"
              />
              <p className="mt-[8pt] max-w-3xl text-base leading-relaxed text-black/55 md:mt-[10pt] md:text-lg">
                For more details, visit{" "}
                <HoverPeek url={CRS_URL}>
                  <Link
                    href={CRS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-[#0a1218] transition-colors hover:text-black"
                  >
                    <SpringUnderline className="pb-0.5 font-medium">
                      Collegiate Racing Series (drivecrs.com)
                    </SpringUnderline>
                  </Link>
                </HoverPeek>
              </p>
            </div>
          </section>
        </PageEnter>
      </main>
      <SiteFooter />
    </>
  );
}
