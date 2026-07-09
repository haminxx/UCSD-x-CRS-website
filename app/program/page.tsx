import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function ProgramPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f5f0] px-6 text-center">
        <h1 className="text-4xl font-semibold md:text-5xl">Program</h1>
        <p className="text-muted-foreground">Coming soon.</p>
        <Link
          href="/"
          className="text-muted-foreground hover:text-accent-foreground underline underline-offset-4"
        >
          Back to Home
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
