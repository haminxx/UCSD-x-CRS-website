"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageEnter } from "@/components/page-motion";
import { SpringUnderline } from "@/components/spring-underline";
import { cn } from "@/lib/utils";

export default function SponsorsPage() {
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
                Join Our Mission
              </h1>
              <div className="mt-8 max-w-3xl space-y-3 text-base leading-relaxed text-black/55 md:mt-10 md:text-lg">
                <p className="md:whitespace-nowrap">
                  We are actively looking for sponsors to help elevate our
                  platform.
                </p>
                <p>
                  <Link
                    href="/contact/"
                    className="inline-flex text-[#0a1218] transition-colors hover:text-black"
                  >
                    <SpringUnderline className="pb-0.5 font-medium">
                      Interested? Let&apos;s start a conversation.
                    </SpringUnderline>
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </PageEnter>
      </main>
      <SiteFooter />
    </>
  );
}
