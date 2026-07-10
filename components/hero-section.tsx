'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SpringUnderline } from '@/components/spring-underline'
import { ChevronRight } from 'lucide-react'

function SponsorLink() {
    return (
        <Link
            href="/sponsors/"
            className="inline-flex items-center px-2 py-2 text-base text-white mix-blend-difference"
        >
            <SpringUnderline className="text-nowrap pb-0.5">
                Become a Sponsor
            </SpringUnderline>
        </Link>
    )
}

export function HeroSection() {
    return (
        <>
            <SiteHeader />
            <main className="overflow-x-hidden">
                <section className="px-1 pt-1">
                    <div className="relative isolate min-h-[min(92vh,56rem)] overflow-hidden rounded-3xl border border-black/10 sm:min-h-[min(88vh,48rem)] lg:rounded-[3rem] dark:border-white/5">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 size-full scale-125 object-cover"
                            src="/videos/ucsdxcrs.mp4"
                        />

                        <div className="relative z-10 mx-auto flex min-h-[min(92vh,56rem)] max-w-7xl flex-col justify-center px-6 pb-16 pt-28 sm:min-h-[min(88vh,48rem)] lg:px-12 lg:pb-20 lg:pt-36">
                            <div className="mx-auto w-full max-w-3xl text-center sm:max-w-4xl lg:ml-0 lg:max-w-full lg:text-left">
                                <h1 className="max-w-none text-[clamp(2.1rem,6.5vw,4.5rem)] font-black leading-[1.1] tracking-tight text-white mix-blend-difference md:text-6xl xl:text-7xl">
                                    <span className="block whitespace-nowrap">Engineering the future</span>
                                    <span className="block">of collegiate motorsport</span>
                                </h1>
                                <p className="mt-6 max-w-2xl text-balance text-lg text-white mix-blend-difference md:mt-8">
                                    Learning by doing. We run a fully structured, student-led organization applying hands-on knowledge to compete in the Collegiate Racing Series.
                                </p>

                                <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:mt-10 lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-12 rounded-full border-0 bg-white pl-5 pr-3 text-base text-black shadow-none hover:bg-white/90 hover:text-black">
                                        <Link href="/recruitment/">
                                            <span className="text-nowrap">Join the team</span>
                                            <ChevronRight className="ml-1" />
                                        </Link>
                                    </Button>
                                    <SponsorLink />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-background pb-2">
                    <div className="group relative m-auto max-w-7xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:pr-6">
                                <p className="text-end text-sm">Powering the best teams</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    speedOnHover={20}
                                    speed={40}
                                    gap={112}>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                            alt="Nvidia Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/column.svg"
                                            alt="Column Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/github.svg"
                                            alt="GitHub Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/nike.svg"
                                            alt="Nike Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                            alt="Lemon Squeezy Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/laravel.svg"
                                            alt="Laravel Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-7 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/lilly.svg"
                                            alt="Lilly Logo"
                                            height="28"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-6 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/openai.svg"
                                            alt="OpenAI Logo"
                                            height="24"
                                            width="auto"
                                        />
                                    </div>
                                </InfiniteSlider>

                                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    aria-label="Section placeholder 1"
                    className="flex min-h-dvh items-start bg-[#f7f5f0] px-6 pt-24 md:px-10 lg:px-12"
                >
                    <div className="mx-auto w-full max-w-7xl">
                        <p className="text-sm tracking-wide text-neutral-400">
                            Section — coming soon
                        </p>
                    </div>
                </section>

                <section
                    aria-label="Section placeholder 2"
                    className="flex min-h-dvh items-start bg-[#f7f5f0] px-6 pt-24 md:px-10 lg:px-12"
                >
                    <div className="mx-auto w-full max-w-7xl">
                        <p className="text-sm tracking-wide text-neutral-400">
                            Section — coming soon
                        </p>
                    </div>
                </section>

                <section
                    aria-label="Section placeholder 3"
                    className="flex min-h-dvh items-start bg-[#f7f5f0] px-6 pt-24 md:px-10 lg:px-12"
                >
                    <div className="mx-auto w-full max-w-7xl">
                        <p className="text-sm tracking-wide text-neutral-400">
                            Section — coming soon
                        </p>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </>
    )
}
