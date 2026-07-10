"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const EMPTY_SPONSOR_SLOTS = 32;

export default function SponsorsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background text-foreground">
        <section className="px-6 pb-24 pt-32 md:px-10 md:pt-40 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
                Partners powering UCSD x CRS on and off the track
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground md:mt-8 md:text-lg">
                We collaborate with ambitious brands and organizations that
                believe in student-built racing, engineering excellence, and
                the next generation of makers.
              </p>
            </div>

            <p className="mt-20 text-sm font-medium tracking-wide text-white/50 md:mt-28">
              Trusted by Visionaries
            </p>

            <div className="mt-5 grid grid-cols-2 border border-white/20 sm:grid-cols-4 lg:grid-cols-8">
              {Array.from({ length: EMPTY_SPONSOR_SLOTS }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] border border-white/20 bg-transparent"
                  aria-label={`Sponsor slot ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
