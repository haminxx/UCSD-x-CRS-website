"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageEnter } from "@/components/page-motion";
import { SpringUnderline } from "@/components/spring-underline";
import { HoverPeek } from "@/components/ui/hover-peek";
import { cn } from "@/lib/utils";

const CRS_URL = "https://drivecrs.com/";

export default function ProgramPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#F2F0EF] text-[#0a1218]">
        <PageEnter>
          <section className="flex min-h-dvh items-center justify-center px-6 pb-24 pt-28 md:px-10 md:pb-28 md:pt-32 lg:px-16">
            <div className="mx-auto flex max-w-4xl -translate-y-2 flex-col items-center text-center md:-translate-y-4 lg:-translate-y-6">
              <h1
                className={cn(
                  "text-balance font-bold text-[#0a1218]",
                  "text-[clamp(3.25rem,7.5vw,6.75rem)]",
                  "leading-[1.05] tracking-[-0.04em]",
                )}
              >
                Coming Soon
              </h1>
              <p className="mt-8 max-w-3xl text-base leading-relaxed text-black/55 md:mt-10 md:text-lg">
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
