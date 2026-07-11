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
        <BackgroundPaths title="Join Our Mission" className="pb-24 pt-20 md:pb-28 md:pt-24">
          <div className="mx-auto max-w-3xl space-y-3 text-center text-base leading-relaxed text-black/55 md:text-lg">
            <p className="text-balance md:whitespace-nowrap">
              We are actively looking for sponsors to help elevate our platform.
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
        </BackgroundPaths>
      </main>
      <SiteFooter />
    </>
  );
}
