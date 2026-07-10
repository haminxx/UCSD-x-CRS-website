"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Paperclip,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

const SERVICES = ["Brand", "Digital", "Campaign", "Other"] as const;
const BUDGETS = [
  "Under £20k",
  "£20-50k",
  "£50-£80k",
  "£80-£150k",
  "Over £150k",
  "Not sure",
] as const;
const TIMEFRAMES = [
  "0-3 months",
  "3-6 months",
  "6-12 months",
  "12+ months",
  "Not sure",
] as const;

type Service = (typeof SERVICES)[number];
type Budget = (typeof BUDGETS)[number];
type Timeframe = (typeof TIMEFRAMES)[number];

const SECTION_COUNT = 4;
const easePremium = [0.22, 1, 0.36, 1] as const;

function PillButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-colors md:px-5 md:py-2.5",
        selected
          ? "border-[#0a1218] bg-[#0a1218] text-white"
          : "border-black/20 bg-transparent text-black/70 hover:border-black/40 hover:text-black",
      )}
    >
      {label}
    </button>
  );
}

function SoftInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border-0 bg-[#eef1f3] px-4 py-3.5 text-sm text-[#0a1218] placeholder:text-black/40 outline-none ring-0 transition-[box-shadow] focus:bg-[#e4e8eb] focus:ring-2 focus:ring-black/15",
        className,
      )}
      {...props}
    />
  );
}

function ContactSection({
  active,
  children,
  className,
}: {
  active: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[calc(100dvh-5.5rem)] w-full items-center justify-center px-6 py-16 md:min-h-[calc(100dvh-6rem)] md:px-10",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key="section-content"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.7, ease: easePremium }}
            className="mx-auto w-full max-w-2xl"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe | null>(null);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  function toggleService(service: Service) {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log({
      firstName,
      lastName,
      company,
      email,
      services,
      budget,
      timeframe,
      message,
      fileName,
      privacyAgreed,
    });
  }

  const goToSection = useCallback((index: number) => {
    const next = Math.max(0, Math.min(SECTION_COUNT - 1, index));
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const section = scroller.querySelectorAll<HTMLElement>("[data-contact-section]")[
      next
    ];
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(next);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const sections = scroller.querySelectorAll<HTMLElement>(
      "[data-contact-section]",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number(
          (visible.target as HTMLElement).dataset.contactSection,
        );
        if (!Number.isNaN(idx)) setActiveSection(idx);
      },
      { root: scroller, threshold: [0.45, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="bg-white text-[#0a1218]">
        <form onSubmit={handleSubmit} className="relative">
          <div
            ref={scrollerRef}
            className="h-dvh snap-y snap-mandatory overflow-y-auto scroll-smooth pt-20 md:pt-24"
          >
            {/* Section 1 — personal */}
            <section
              data-contact-section={0}
              className="snap-start snap-always"
            >
              <ContactSection active={activeSection === 0}>
                <h1 className="text-center text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-[3.1rem]">
                  Let&apos;s talk about your next project...
                </h1>
                <div className="mt-12 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SoftInput
                      name="firstName"
                      autoComplete="given-name"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <SoftInput
                      name="lastName"
                      autoComplete="family-name"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <SoftInput
                    name="company"
                    autoComplete="organization"
                    placeholder="Company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <SoftInput
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </ContactSection>
            </section>

            {/* Section 2 — service & budget */}
            <section
              data-contact-section={1}
              className="snap-start snap-always"
            >
              <ContactSection active={activeSection === 1}>
                <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
                  What sort of service?
                </h2>
                <p className="mt-4 text-center text-sm text-black/50">
                  Select all that apply
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                  {SERVICES.map((service) => (
                    <PillButton
                      key={service}
                      label={service}
                      selected={services.includes(service)}
                      onClick={() => toggleService(service)}
                    />
                  ))}
                </div>

                <p className="mt-12 text-center text-sm text-black/80 md:text-base">
                  What rough budget are we working within?
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                  {BUDGETS.map((option) => (
                    <PillButton
                      key={option}
                      label={option}
                      selected={budget === option}
                      onClick={() =>
                        setBudget((prev) => (prev === option ? null : option))
                      }
                    />
                  ))}
                </div>
              </ContactSection>
            </section>

            {/* Section 3 — anything else */}
            <section
              data-contact-section={2}
              className="snap-start snap-always"
            >
              <ContactSection active={activeSection === 2}>
                <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
                  Anything else?
                </h2>
                <p className="mt-7 text-center text-sm text-black/80 md:text-base">
                  Do you have a specific timeframe in mind?
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                  {TIMEFRAMES.map((option) => (
                    <PillButton
                      key={option}
                      label={option}
                      selected={timeframe === option}
                      onClick={() =>
                        setTimeframe((prev) =>
                          prev === option ? null : option,
                        )
                      }
                    />
                  ))}
                </div>

                <label
                  htmlFor="message"
                  className="mt-12 block text-center text-sm text-black/80 md:text-base"
                >
                  Anything you&apos;d like to add?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Message (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-4 w-full resize-y rounded-xl border-0 bg-[#eef1f3] px-4 py-3.5 text-sm text-[#0a1218] placeholder:text-black/40 outline-none transition-[box-shadow] focus:bg-[#e4e8eb] focus:ring-2 focus:ring-black/15"
                />

                <div className="relative mt-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-between rounded-xl border-0 bg-[#eef1f3] px-4 py-3.5 text-left text-sm text-black/40 transition-colors hover:bg-[#e4e8eb]"
                  >
                    <span className={cn(fileName && "text-[#0a1218]")}>
                      {fileName ?? "Attachments (optional)"}
                    </span>
                    <Paperclip className="size-4 shrink-0 text-black/45" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFileName(file?.name ?? null);
                    }}
                  />
                </div>
              </ContactSection>
            </section>

            {/* Section 4 — submit */}
            <section
              data-contact-section={3}
              className="snap-start snap-always"
            >
              <ContactSection active={activeSection === 3}>
                <div className="flex flex-col items-center gap-8 text-center">
                  <label className="flex max-w-md cursor-pointer items-start gap-3 text-left text-sm text-black/50">
                    <input
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      required
                      className="mt-0.5 size-4 shrink-0 rounded border-black/30 accent-black"
                    />
                    <span>
                      I have read and agree to the{" "}
                      <Link
                        href="#"
                        className="underline underline-offset-2 hover:text-[#0a1218]"
                      >
                        Privacy Policy ↗
                      </Link>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0a1218] px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-black"
                  >
                    Submit
                    <ArrowUpRight className="size-4" />
                  </button>
                </div>
              </ContactSection>
            </section>
          </div>

          {/* Up / down section controls */}
          <div className="pointer-events-none fixed right-5 bottom-8 z-40 flex flex-col gap-2 md:right-8 md:bottom-10">
            <button
              type="button"
              aria-label="Previous section"
              disabled={activeSection === 0}
              onClick={() => goToSection(activeSection - 1)}
              className={cn(
                "pointer-events-auto flex size-11 items-center justify-center rounded-full border border-black/15 bg-white/90 text-[#0a1218] shadow-md backdrop-blur transition",
                "hover:bg-white disabled:cursor-not-allowed disabled:opacity-35",
              )}
            >
              <ArrowUp className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next section"
              disabled={activeSection >= SECTION_COUNT - 1}
              onClick={() => goToSection(activeSection + 1)}
              className={cn(
                "pointer-events-auto flex size-11 items-center justify-center rounded-full border border-black/15 bg-white/90 text-[#0a1218] shadow-md backdrop-blur transition",
                "hover:bg-white disabled:cursor-not-allowed disabled:opacity-35",
              )}
            >
              <ArrowDown className="size-4" />
            </button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
