"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { SpringUnderline } from "@/components/spring-underline";

export default function SponsorsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#F2F0EF] text-[#0a1218]">
        <BackgroundPaths
          title="Join Our Mission"
          className="pb-[clamp(4rem,12vw,7rem)] pt-[clamp(3.5rem,10vw,6rem)]"
        >
          <div className="mx-auto w-full max-w-[min(92%,42rem)] space-y-[clamp(0.5rem,2vw,0.875rem)] text-center text-[clamp(0.875rem,2.8vw,1.125rem)] leading-[1.65] text-[#182B49]/60">
            <p className="text-balance">
              We are actively looking for sponsors to help elevate our platform.
            </p>
            <p>
              <Link
                href="/contact/"
                className="inline-flex text-[#182B49] transition-colors hover:text-[#0a1218]"
              >
                <SpringUnderline className="pb-0.5 font-medium">
                  Interested? Let&apos;s start a conversation.
                </SpringUnderline>
              </Link>
            </p>
          </div>
        </BackgroundPaths>
      </main>
      <SiteFooter />
    </>
  );
}
