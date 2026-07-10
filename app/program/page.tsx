import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function ProgramPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-white px-6 text-center text-[#0a1218]">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Program
        </h1>
        <p className="text-black/50">Coming soon.</p>
        <Link
          href="/"
          className="mt-2 text-black/50 underline underline-offset-4 transition-colors hover:text-[#0a1218]"
        >
          Back to Home
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
