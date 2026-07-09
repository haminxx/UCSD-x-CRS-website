import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

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
      <SiteHeader theme="dark" />
      <main className="relative min-h-dvh overflow-hidden text-white">
        {/* Video-ready full-bleed background — drop a src on <video> when ready */}
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 20% 30%, #c5c98a 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 80% 20%, #e8d9a0 0%, transparent 50%), radial-gradient(ellipse 70% 80% at 70% 80%, #8a9a6a 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 15% 85%, #6b7a52 0%, transparent 50%), linear-gradient(145deg, #9aa87a 0%, #b8a86a 35%, #7d8f5c 70%, #5a6b45 100%)",
            }}
          />
          <div className="absolute inset-0 scale-110 blur-2xl opacity-80">
            <div
              className="size-full"
              style={{
                background:
                  "radial-gradient(circle at 40% 40%, rgba(232, 217, 160, 0.55), transparent 45%), radial-gradient(circle at 65% 60%, rgba(107, 122, 82, 0.5), transparent 40%)",
              }}
            />
          </div>
          {/* Placeholder video: add src when asset is available */}
          <video
            className="absolute inset-0 size-full object-cover opacity-0"
            muted
            autoPlay
            loop
            playsInline
            // src="/videos/recruitment-hero.mp4"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/35" />
        </div>

        <section className="relative z-10 flex min-h-dvh flex-col justify-center px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-32 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <h1 className="flex flex-col items-center gap-4 text-center text-[clamp(2.25rem,6.5vw,5.5rem)] font-light leading-[1.05] tracking-tight text-white md:flex-row md:items-center md:justify-between md:gap-6 md:text-left">
              <span className="md:max-w-[42%] md:flex-1">life is a creative</span>
              <FloralMark className="size-8 shrink-0 text-white/85 md:size-10 lg:size-12" />
              <span className="md:max-w-[42%] md:flex-1 md:text-right">
                Join the team
              </span>
            </h1>

            <div className="mt-8 flex flex-col gap-8 md:mt-10 md:ml-auto md:max-w-[42%] md:gap-10">
              <div className="h-px w-16 bg-white/80 md:ml-auto" />

              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                <p className="max-w-sm text-left text-sm leading-relaxed text-white/85 md:text-[0.95rem]">
                  Build, race, and grow with UCSD x CRS. Bring your craft to a
                  team that turns late nights into lap times — and purpose into
                  every mile.
                </p>

                <a
                  href={JOIN_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium tracking-wide text-zinc-950 transition hover:bg-white/90"
                >
                  JOIN US
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
