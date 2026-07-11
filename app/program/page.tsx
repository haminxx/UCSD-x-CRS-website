import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SpringUnderline } from "@/components/spring-underline";
import { HoverPeek } from "@/components/ui/hover-peek";

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

/** Static program hero — no canvas / letter animations for faster first paint. */
export default function ProgramPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-[#F2F0EF] text-[#0a1218]">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
          <div
            className="absolute inset-0 -translate-y-[6vh] opacity-[0.42] md:translate-y-[1vh]"
            style={{
              ...tritonMaskStyle,
              background:
                "radial-gradient(circle at 30% 40%, rgba(24,43,73,0.55), rgba(24,43,73,0.18) 55%, transparent 72%)",
            }}
          />
        </div>

        <section className="relative z-10 flex min-h-dvh items-center justify-center px-6 pb-24 pt-32 md:px-10 md:pb-28 md:pt-36 lg:px-16">
          <div className="mx-auto flex max-w-4xl -translate-y-2 flex-col items-center text-center md:translate-y-2 lg:translate-y-6">
            <h1 className="whitespace-nowrap text-[clamp(2.75rem,12vw,6.75rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#0a1218] md:text-[clamp(1.65rem,6.5vw,6.75rem)]">
              Coming Soon
            </h1>
            <p className="-mt-12 max-w-3xl text-base leading-relaxed text-black/55 md:-mt-14 md:text-lg">
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
      </main>
      <SiteFooter />
    </>
  );
}
