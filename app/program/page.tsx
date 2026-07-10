import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageEnter } from "@/components/page-motion";
import { ProgramImpactScroll } from "@/components/program-impact-scroll";
import { HowItWorks } from "@/components/how-it-works";

export default function ProgramPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#F5F0E6] text-[#0a1218]">
        <section className="px-6 pb-6 pt-32 md:px-10 md:pb-10 md:pt-40 lg:px-16">
          <PageEnter className="mx-auto max-w-7xl">
            <p className="font-mono text-[11px] tracking-[0.22em] text-black/40 uppercase">
              Collegiate Racing Series
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              The program behind the grid
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-black/55 md:text-lg">
              UCSD × CRS is a fully structured, student-led motorsport organization —
              engineering, driving, pit crew, media, and ops working as one race team.
            </p>
          </PageEnter>
        </section>

        <ProgramImpactScroll />
        <HowItWorks />
      </main>
      <SiteFooter />
    </>
  );
}
