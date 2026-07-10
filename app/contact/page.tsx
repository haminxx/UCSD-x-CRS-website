"use client";

import {
  useRef,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
} from "react";
import Link from "next/link";
import { ArrowUpRight, Paperclip } from "lucide-react";
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
          ? "border-white bg-white text-[#193c47]"
          : "border-white/25 bg-transparent text-white/80 hover:border-white/50 hover:text-white"
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
        "w-full rounded-xl border-0 bg-[#2a5460] px-4 py-3.5 text-sm text-foreground placeholder:text-white/40 outline-none ring-0 transition-[box-shadow] focus:bg-[#346270] focus:ring-2 focus:ring-white/15",
        className
      )}
      {...props}
    />
  );
}

export default function ContactPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        : [...prev, service]
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

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background text-foreground">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40"
        >
          {/* Personal Information */}
          <section>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-[3.25rem]">
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
          </section>

          <hr className="my-14 border-0 border-t border-white/15" />

          {/* Service and Budget */}
          <section>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              What sort of service?
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Select all that apply
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {SERVICES.map((service) => (
                <PillButton
                  key={service}
                  label={service}
                  selected={services.includes(service)}
                  onClick={() => toggleService(service)}
                />
              ))}
            </div>

            <p className="mt-12 text-sm text-white/85 md:text-base">
              What rough budget are we working within?
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
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
          </section>

          <hr className="my-14 border-0 border-t border-white/15" />

          {/* Additional Details */}
          <section>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Anything else?
            </h2>
            <p className="mt-7 text-sm text-white/85 md:text-base">
              Do you have a specific timeframe in mind?
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {TIMEFRAMES.map((option) => (
                <PillButton
                  key={option}
                  label={option}
                  selected={timeframe === option}
                  onClick={() =>
                    setTimeframe((prev) => (prev === option ? null : option))
                  }
                />
              ))}
            </div>

            <label
              htmlFor="message"
              className="mt-12 block text-sm text-white/85 md:text-base"
            >
              Anything you&apos;d like to add?
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-4 w-full resize-y rounded-xl border-0 bg-[#2a5460] px-4 py-3.5 text-sm text-foreground placeholder:text-white/40 outline-none transition-[box-shadow] focus:bg-[#346270] focus:ring-2 focus:ring-white/15"
            />

            <div className="relative mt-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-between rounded-xl border-0 bg-[#2a5460] px-4 py-3.5 text-left text-sm text-white/40 transition-colors hover:bg-[#346270]"
              >
                <span className={cn(fileName && "text-foreground")}>
                  {fileName ?? "Attachments (optional)"}
                </span>
                <Paperclip className="size-4 shrink-0 text-white/45" />
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
          </section>

          <hr className="my-14 border-0 border-t border-white/15" />

          {/* Submission footer */}
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                required
                className="mt-0.5 size-4 shrink-0 rounded border-white/30 accent-white"
              />
              <span>
                I have read and agree to the{" "}
                <Link
                  href="#"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Privacy Policy ↗
                </Link>
              </span>
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-medium text-[#193c47] transition-colors hover:bg-white/90 sm:self-auto"
            >
              Submit
              <ArrowUpRight className="size-4" />
            </button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
